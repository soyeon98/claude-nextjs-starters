"use client"

import Link from "next/link"
import { ArrowLeft, Eye, Link2 } from "lucide-react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { InvoiceView } from "@/components/invoice/invoice-view"
import { cn } from "@/lib/utils"
import type { InvoiceDetail } from "@/types"

interface InvoiceDetailClientProps {
  invoiceId: string
  invoice: InvoiceDetail | null
}

export function InvoiceDetailClient({ invoiceId, invoice }: InvoiceDetailClientProps) {

  /**
   * 공유 URL을 클립보드에 복사합니다.
   */
  async function handleCopyShareLink() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/view/${invoiceId}`
      )
      toast.success("공유 링크가 복사되었습니다.")
    } catch {
      toast.error("복사에 실패했습니다.")
    }
  }

  /**
   * 금액을 한국 원화 형식으로 포맷합니다.
   */
  function formatAmount(amount: number): string {
    return `₩${amount.toLocaleString("ko-KR")}`
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* 헤더 — SidebarTrigger + Breadcrumb */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-sidebar/40 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">홈</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/invoices">견적서</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {invoice ? invoice.title : invoiceId}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      {/* 본문 */}
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="mx-auto w-full max-w-4xl flex flex-col gap-6">
        {/* 액션 바 — 목록으로 버튼 + 우측 액션 버튼 */}
        <div
          className={cn(
            "flex flex-col gap-2",
            "sm:flex-row sm:items-center sm:justify-between"
          )}
        >
          {/* 목록으로 버튼 */}
          <Button asChild variant="outline" size="sm" className="self-start">
            <Link href="/dashboard/invoices">
              <ArrowLeft className="size-4" />
              목록으로
            </Link>
          </Button>

          {/* 우측 액션 버튼 그룹 */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {/* 미리보기 버튼 */}
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/invoices/${invoiceId}/preview`}>
                <Eye className="size-4" />
                미리보기
              </Link>
            </Button>
            {/* 공유 링크 복사 버튼 */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyShareLink}
              disabled={!invoice}
            >
              <Link2 className="size-4" />
              공유 링크 복사
            </Button>
          </div>
        </div>

        {/* 견적서를 찾을 수 없을 때 표시 */}
        {!invoice ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
            <p className="text-base text-muted-foreground">
              견적서를 찾을 수 없습니다.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/invoices">
                <ArrowLeft className="size-4" />
                목록으로 돌아가기
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* 메타정보 카드 */}
            <Card>
              <CardHeader>
                <p className="text-base font-semibold">견적서 정보</p>
              </CardHeader>
              <CardContent>
                {/* 2열 그리드, 모바일 1열 */}
                <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                  {/* 견적서 번호 */}
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      견적서 번호
                    </dt>
                    <dd className="text-sm font-semibold">{invoice.title}</dd>
                  </div>

                  {/* 클라이언트명 */}
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      클라이언트명
                    </dt>
                    <dd className="text-sm font-semibold">
                      {invoice.clientName}
                    </dd>
                  </div>

                  {/* 발행일 */}
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      발행일
                    </dt>
                    <dd className="text-sm">{invoice.issueDate}</dd>
                  </div>

                  {/* 유효기간 */}
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      유효기간
                    </dt>
                    <dd className="text-sm">{invoice.validUntil}</dd>
                  </div>

                  {/* 총금액 */}
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      총금액
                    </dt>
                    <dd className="text-sm font-bold">
                      {formatAmount(invoice.totalAmount)}
                    </dd>
                  </div>

                  {/* 공유 URL */}
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      공유 URL
                    </dt>
                    <dd className="text-sm break-all text-muted-foreground">
                      {typeof window !== "undefined"
                        ? `${window.location.origin}/view/${invoiceId}`
                        : `/view/${invoiceId}`}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* 견적 내용 카드 */}
            <Card>
              <CardHeader>
                <p className="text-base font-semibold">견적 내용</p>
              </CardHeader>
              <CardContent>
                {/* InvoiceView 재사용 — isPreview=false (amber 배너 미표시) */}
                <InvoiceView invoice={invoice} isPreview={false} />
              </CardContent>
            </Card>
          </>
        )}
        </div>
      </div>
    </div>
  )
}
