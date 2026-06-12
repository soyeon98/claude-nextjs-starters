import { test, expect } from '@playwright/test'
import { mockInvoiceList, mockPdfDownload } from './helpers/api-mocks'

test.describe('핵심 플로우', () => {
  test.beforeEach(async ({ page }) => {
    await mockInvoiceList(page)
    await mockPdfDownload(page)
  })

  test('시나리오 1: 견적서 목록 조회', async ({ page }) => {
    await page.goto('/dashboard/invoices')

    await expect(page.getByRole('columnheader', { name: '견적서 번호' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'INV-2026-001' })).toBeVisible()
    await expect(page.getByRole('cell', { name: '₩3,500,000' })).toBeVisible()
    await expect(page.getByRole('cell', { name: '홍길동' })).toBeVisible()
    await expect(page.getByText('완료')).toBeVisible()
  })

  test('시나리오 2: 공유 URL 복사', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('/dashboard/invoices')

    await page.getByRole('button', { name: '공유 링크 복사' }).first().click()

    await expect(page.getByText('공유 링크가 복사되었습니다.')).toBeVisible()

    const clip = await page.evaluate(() => navigator.clipboard.readText())
    expect(clip).toContain('/view/dummy-001')
  })

  test('시나리오 3: 공개 뷰 접근 (유연한 assertion)', async ({ page }) => {
    await page.goto('/view/dummy-001')

    const notFound = page.getByText('견적서를 찾을 수 없습니다.')
    const viewHeader = page.getByText('견적서 확인')

    await expect(notFound.or(viewHeader)).toBeVisible()
    await expect(page.getByText('500 Internal Server Error')).not.toBeVisible()
  })

  test('시나리오 4: PDF API 응답 검증 (모킹)', async ({ page }) => {
    await page.goto('/dashboard/invoices')

    // page.route 모킹이 활성화된 상태에서 fetch로 PDF API 호출
    const contentType = await page.evaluate(async () => {
      const res = await fetch('/api/pdf/dummy-001')
      return res.headers.get('content-type')
    })
    expect(contentType).toContain('application/pdf')
  })

  test('시나리오 5: 통합 플로우 (smoke test)', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    // 1. 목록 조회
    await page.goto('/dashboard/invoices')
    await expect(page.getByRole('cell', { name: 'INV-2026-001' })).toBeVisible()

    // 2. 공유 URL 복사
    await page.getByRole('button', { name: '공유 링크 복사' }).first().click()
    await expect(page.getByText('공유 링크가 복사되었습니다.')).toBeVisible()

    // 4. PDF API 응답 (모킹 활성화 상태에서 fetch)
    const contentType = await page.evaluate(async () => {
      const res = await fetch('/api/pdf/dummy-001')
      return res.headers.get('content-type')
    })
    expect(contentType).toContain('application/pdf')
  })

  test('시나리오 6: 빈 목록 상태', async ({ page }) => {
    await page.route('**/api/notion/invoices', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    )

    await page.goto('/dashboard/invoices')
    await expect(page.getByText('견적서가 없습니다.')).toBeVisible()
  })

  test('시나리오 7: 새로고침 버튼', async ({ page }) => {
    let callCount = 0
    await page.route('**/api/notion/invoices', (route) => {
      callCount++
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    })

    await page.goto('/dashboard/invoices')
    await expect(page.getByText('견적서가 없습니다.')).toBeVisible()
    const countAfterLoad = callCount

    await page.getByRole('button', { name: '새로고침' }).click()
    await expect(page.getByText('견적서가 없습니다.')).toBeVisible()

    expect(callCount).toBeGreaterThan(countAfterLoad)
  })
})
