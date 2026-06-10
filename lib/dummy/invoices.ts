import type { InvoiceSummary, InvoiceDetail } from '@/types'

/** 견적서 목록 더미 데이터 */
export const DUMMY_INVOICES: InvoiceSummary[] = [
  {
    notionPageId: 'dummy-001',
    title: 'INV-2026-001',
    amount: 3500000,
    issueDate: '2026-06-01',
    clientName: '홍길동',
    status: '완료',
  },
  {
    notionPageId: 'dummy-002',
    title: 'INV-2026-002',
    amount: 1200000,
    issueDate: '2026-06-03',
    clientName: '김철수',
    status: '대기',
  },
  {
    notionPageId: 'dummy-003',
    title: 'INV-2026-003',
    amount: 800000,
    issueDate: null,
    clientName: null,
    status: null,
  },
]

/** 견적서 상세 더미 데이터 */
export const DUMMY_INVOICE_DETAIL: InvoiceDetail = {
  notionPageId: 'dummy-001',
  title: 'INV-2026-001',
  clientName: '홍길동',
  issueDate: '2026-06-01',
  validUntil: '2026-06-30',
  items: [
    {
      id: 'item-1',
      name: '웹사이트 디자인',
      unitPrice: 1500000,
      quantity: 1,
      amount: 1500000,
    },
    {
      id: 'item-2',
      name: '프론트엔드 개발',
      unitPrice: 1000000,
      quantity: 2,
      amount: 2000000,
    },
    {
      id: 'item-3',
      name: '유지보수 (1개월)',
      unitPrice: 500000,
      quantity: 0,
      amount: 0, // 수량 0 = 포함 항목 예시
    },
  ],
  totalAmount: 3500000,
}

/**
 * 토큰(notionPageId)으로 더미 견적서 상세 데이터를 반환합니다.
 * 존재하지 않는 토큰이면 null을 반환합니다.
 */
export function getDummyInvoiceDetail(token: string): InvoiceDetail | null {
  if (DUMMY_INVOICES.some((inv) => inv.notionPageId === token)) {
    return DUMMY_INVOICE_DETAIL
  }
  return null
}
