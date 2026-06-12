import type { Page } from '@playwright/test'
import { MOCK_INVOICES } from '../fixtures/mock-data'
import { DUMMY_PDF_BYTES } from '../fixtures/mock-pdf'

export async function mockInvoiceList(page: Page) {
  await page.route('**/api/notion/invoices', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_INVOICES),
    })
  )
}

export async function mockPdfDownload(page: Page) {
  await page.route('**/api/pdf/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/pdf',
      body: DUMMY_PDF_BYTES,
      headers: { 'Content-Disposition': 'attachment; filename="test.pdf"' },
    })
  )
}
