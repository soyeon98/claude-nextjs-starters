export interface NavItem {
  label: string
  href: string
  external?: boolean
  disabled?: boolean
}

export interface SidebarItem extends NavItem {
  iconKey?: string
  badge?: string | number
}

export interface SidebarGroup {
  label?: string
  items: SidebarItem[]
}

export interface SiteConfig {
  name: string
  description: string
  url: string
  nav: NavItem[]
  footer: NavItem[]
}

// ─────────────────────────────────────────────
// 도메인 데이터 모델
// ─────────────────────────────────────────────

/**
 * 견적서 목록/미리보기에서 사용하는 노션 페이지 메타데이터.
 * 노션 API 응답을 화면 표시용으로 정규화한 형태.
 */
export interface InvoiceSummary {
  /** 노션 페이지 ID */
  notionPageId: string
  /** 견적서 제목 */
  title: string
  /** 견적 금액 (노션 속성에서 추출, 없으면 null) */
  amount: number | null
  /** 발행일 (YYYY-MM-DD, 없으면 null) */
  issueDate: string | null
  /** 클라이언트명 (없으면 null) */
  clientName: string | null
  /** 견적서 상태 (노션 status 속성, 없으면 null) */
  status: string | null
}

/** 견적서 단일 항목 */
export interface InvoiceItem {
  id: string
  name: string
  unitPrice: number
  quantity: number
  amount: number
}

/** 견적서 상세 데이터 */
export interface InvoiceDetail {
  notionPageId: string
  title: string
  clientName: string
  issueDate: string      // 'YYYY-MM-DD'
  validUntil: string     // 'YYYY-MM-DD'
  items: InvoiceItem[]
  totalAmount: number
}
