import { test, expect } from '@playwright/test'
import { mockInvoiceList } from './helpers/api-mocks'

test.describe('접근성 검증', () => {
  test.beforeEach(async ({ page }) => {
    await mockInvoiceList(page)
    await page.goto('/dashboard/invoices')
  })

  test('시나리오 1: Tab 포커스 동작', async ({ page }) => {
    await page.keyboard.press('Tab')
    const tag = await page.evaluate(() => document.activeElement?.tagName)
    expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(tag)
  })

  test('시나리오 2: sr-only 텍스트 존재', async ({ page }) => {
    await expect(page.locator('.sr-only', { hasText: '미리보기' }).first()).toBeAttached()
    await expect(page.locator('.sr-only', { hasText: '공유 링크 복사' }).first()).toBeAttached()
  })

  test('시나리오 3: 헤더 랜드마크 존재', async ({ page }) => {
    await expect(page.locator('header')).toBeAttached()
  })

  test('시나리오 4: h1 단독 존재 및 텍스트 확인', async ({ page }) => {
    expect(await page.locator('h1').count()).toBe(1)
    await expect(page.locator('h1')).toContainText('견적서')
  })
})
