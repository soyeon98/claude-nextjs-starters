import type { Metadata } from "next"
import Link from "next/link"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InvoiceView } from "@/components/invoice/invoice-view"
import { getInvoiceDetail } from "@/lib/notion/invoice-fetcher"

/**
 * 공개 견적서 뷰 페이지 (F004, F005).
 * 별도 로그인 없이 토큰 URL로 견적서를 확인하고 PDF로 다운로드합니다.
 * Next.js 16에서 params는 Promise 이므로 반드시 await 합니다.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>
}): Promise<Metadata> {
  const { token } = await params
  const invoice = await getInvoiceDetail(token)

  if (!invoice) {
    return {
      title: "견적서를 찾을 수 없습니다.",
      description: "요청하신 견적서가 존재하지 않습니다.",
    }
  }

  return {
    title: `견적서 — ${invoice.title}`,
    description: `${invoice.clientName} 귀중 | 발행일: ${invoice.issueDate}`,
  }
}

export default async function ViewInvoicePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const invoice = await getInvoiceDetail(token)

  /* 견적서를 찾을 수 없는 경우 */
  if (!invoice) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-24 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            견적서를 찾을 수 없습니다.
          </h1>
          <p className="text-sm text-muted-foreground">
            요청하신 견적서가 존재하지 않거나 만료되었습니다.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    )
  }

  /* 견적서 정상 표시 */
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-12">
      {/* 상단 액션 바 */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-muted-foreground">
          견적서 확인
        </h1>
        <Button asChild variant="outline" size="sm">
          <a href={`/api/pdf/${token}`} download>
            <Download className="size-4" />
            PDF 다운로드
          </a>
        </Button>
      </div>

      {/* 견적서 본문 */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <InvoiceView invoice={invoice} />
      </div>
    </div>
  )
}
