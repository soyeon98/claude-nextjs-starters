import type { SiteConfig } from "@/types"

export const siteConfig: SiteConfig = {
  name: "견적서 공유",
  description:
    "노션에서 작성한 견적서를 클라이언트에게 웹 URL로 공유하고 PDF로 다운로드하세요.",
  url: "https://example.com",
  nav: [
    { label: "홈", href: "/" },
    { label: "견적서", href: "/dashboard/invoices" },
    { label: "노션 연동", href: "/settings/notion" },
  ],
  footer: [
    { label: "개인정보처리방침", href: "/privacy" },
    { label: "이용약관", href: "/terms" },
  ],
}

// 아이콘은 NavMain 내부에서 iconKey로 매핑하여 사용 (Server→Client 직렬화 문제 방지)
export const dashboardNav = [
  {
    label: "견적서",
    items: [
      { label: "견적서 목록", href: "/dashboard/invoices", iconKey: "fileText" },
    ],
  },
  {
    label: "설정",
    items: [
      { label: "노션 연동", href: "/settings/notion", iconKey: "plug" },
    ],
  },
]
