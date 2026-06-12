import { test, expect } from '@playwright/test'
import { mockInvoiceList } from './helpers/api-mocks'

test.describe('보안 검증', () => {
  test('시나리오 1: API 응답에 시크릿 키 미포함', async ({ page }) => {
    await mockInvoiceList(page)

    const capturedBodies: string[] = []
    page.on('response', async (r) => {
      if (r.url().includes('/api/')) {
        capturedBodies.push(await r.text().catch(() => ''))
      }
    })

    await page.goto('/dashboard/invoices')
    await page.waitForLoadState('networkidle')

    capturedBodies.forEach((b) => {
      expect(b).not.toMatch(/secret_[A-Za-z0-9]{20,}/)
    })
  })

  test('시나리오 2: HTML 응답에 시크릿 키 미포함', async ({ page }) => {
    await mockInvoiceList(page)

    const htmlBodies: string[] = []
    page.on('response', async (r) => {
      const ct = r.headers()['content-type'] ?? ''
      if (ct.includes('text/html')) {
        htmlBodies.push(await r.text().catch(() => ''))
      }
    })

    await page.goto('/dashboard/invoices')
    await page.waitForLoadState('networkidle')

    htmlBodies.forEach((html) => {
      expect(html).not.toContain('NOTION_API_KEY')
      expect(html).not.toMatch(/secret_[A-Za-z0-9]{20,}/)
    })
  })

  test('시나리오 3: JS 번들에 시크릿 키 미포함', async ({ page }) => {
    test.setTimeout(30000)
    await mockInvoiceList(page)

    const jsBodies: string[] = []
    page.on('response', async (r) => {
      if (r.url().includes('/_next/static/') && r.url().endsWith('.js')) {
        jsBodies.push(await r.text().catch(() => ''))
      }
    })

    await page.goto('/dashboard/invoices')
    await page.waitForLoadState('networkidle')

    jsBodies.forEach((js) => {
      expect(js).not.toMatch(/secret_[A-Za-z0-9]{20,}/)
      expect(js).not.toContain('notionToken')
    })
  })
})
