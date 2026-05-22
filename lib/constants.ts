import type { SiteConfig } from "@/types"

export const siteConfig: SiteConfig = {
  name: "StarterKit",
  description: "Next.js 모던 웹 스타터킷 — 빠르게 개발을 시작하세요.",
  url: "https://example.com",
  nav: [
    { label: "홈", href: "/" },
    { label: "대시보드", href: "/dashboard" },
    { label: "설정", href: "/settings" },
  ],
  footer: [
    { label: "개인정보처리방침", href: "/privacy" },
    { label: "이용약관", href: "/terms" },
    {
      label: "GitHub",
      href: "https://github.com",
      external: true,
    },
  ],
}

// 아이콘은 NavMain 내부에서 iconKey로 매핑하여 사용 (Server→Client 직렬화 문제 방지)
export const dashboardNav = [
  {
    label: "메인",
    items: [
      { label: "홈", href: "/", iconKey: "home" },
      { label: "대시보드", href: "/dashboard", iconKey: "dashboard" },
      { label: "분석", href: "/dashboard/analytics", iconKey: "chart" },
    ],
  },
  {
    label: "관리",
    items: [
      { label: "사용자", href: "/dashboard/users", iconKey: "users" },
      { label: "문서", href: "/dashboard/docs", iconKey: "file" },
    ],
  },
  {
    label: "시스템",
    items: [{ label: "설정", href: "/settings", iconKey: "settings" }],
  },
]
