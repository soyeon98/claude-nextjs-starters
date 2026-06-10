import { redirect } from "next/navigation"

/**
 * /dashboard 진입 시 견적서 목록으로 리다이렉트합니다.
 * 이 서비스의 대시보드 기본 화면은 견적서 목록입니다.
 */
export default function DashboardPage() {
  redirect("/dashboard/invoices")
}
