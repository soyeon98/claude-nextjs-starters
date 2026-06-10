"use client"

import Link from "next/link"
import { ArrowLeft, Download, Link2 } from "lucide-react"
import { toast } from "sonner"
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
import type { InvoiceDetail } from "@/types"

interface InvoicePreviewClientProps {
  /** 노션 페이지 ID (공유 링크 복사에 사용) */
  invoiceId: string
  invoice: InvoiceDetail | null
}

export function InvoicePreviewClient({ invoiceId, invoice }: InvoicePreviewClientProps) {

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

  return (
    <div className="flex flex-1 flex-col">
      {/* 헤더 */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-sidebar/40 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/invoices">견적서</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>미리보기</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      {/* 본문 */}
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="mx-auto w-full max-w-4xl flex flex-col gap-6">
        {/* 상단 액션 바 */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* 좌: 목록으로 돌아가기 */}
          <Button asChild variant="outline" size="sm" className="self-start">
            <Link href="/dashboard/invoices">
              <ArrowLeft className="size-4" />
              목록으로
            </Link>
          </Button>

          {/* 우: PDF 다운로드 + 공유 링크 복사 */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {invoice && (
              <Button asChild variant="outline" size="sm">
                <a href={`/api/pdf/${invoiceId}`} download>
                  <Download className="size-4" />
                  PDF 다운로드
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyShareLink}
            >
              <Link2 className="size-4" />
              공유 링크 복사
            </Button>
          </div>
        </div>

        {/* 견적서가 없는 경우 */}
        {!invoice ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
            <p className="text-base font-medium">
              견적서를 찾을 수 없습니다.
            </p>
            <p className="text-sm text-muted-foreground">
              요청하신 견적서가 존재하지 않습니다. (ID: {invoiceId})
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/invoices">목록으로 돌아가기</Link>
            </Button>
          </div>
        ) : (
          /* 견적서 본문 (관리자 미리보기 배너 포함) */
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <InvoiceView invoice={invoice} isPreview={true} />
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
