import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { InvoiceDetail } from "@/types"

interface InvoiceViewProps {
  invoice: InvoiceDetail
  /** 관리자 미리보기 모드 여부 — true이면 amber 배너 표시 */
  isPreview?: boolean
}

/**
 * 견적서 콘텐츠 공용 렌더링 컴포넌트 (Server Component).
 * 공개 뷰(/view/[token])와 관리자 미리보기(/dashboard/invoices/[id]/preview) 모두에서 사용합니다.
 */
export function InvoiceView({ invoice, isPreview = false }: InvoiceViewProps) {
  /**
   * 금액을 한국 원화 형식으로 포맷합니다.
   */
  function formatCurrency(amount: number): string {
    return `₩${amount.toLocaleString("ko-KR")}`
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 관리자 미리보기 배너 */}
      {isPreview && (
        <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300">
          관리자 미리보기 — 클라이언트에게는 이 배너가 표시되지 않습니다.
        </div>
      )}

      {/* 견적서 헤더 */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">{invoice.title}</h2>
        <div className="flex flex-col gap-0.5 text-sm text-muted-foreground sm:flex-row sm:gap-4">
          <span>발행일: {invoice.issueDate}</span>
          <span>유효기간: {invoice.validUntil}</span>
        </div>
      </div>

      {/* 수신자 */}
      <div className="rounded-md border border-border bg-muted/40 px-4 py-3">
        <p className="text-base font-medium">
          {invoice.clientName}{" "}
          <span className="text-muted-foreground">귀중</span>
        </p>
      </div>

      {/* 견적 항목 테이블 */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          견적 항목
        </h3>
        {/* 모바일 가로 스크롤 지원 */}
        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-full py-3 pl-9">항목명</TableHead>
                <TableHead className="text-right whitespace-nowrap py-3">
                  단가 (₩)
                </TableHead>
                <TableHead className="text-right whitespace-nowrap py-3">
                  수량
                </TableHead>
                <TableHead className="text-right whitespace-nowrap py-3 pr-8">
                  금액 (₩)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium py-3 pl-8">{item.name}</TableCell>
                  <TableCell className="text-right whitespace-nowrap text-muted-foreground py-3">
                    {formatCurrency(item.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground py-3">
                    {item.quantity === 0 ? (
                      <span className="text-xs text-muted-foreground/60">
                        포함
                      </span>
                    ) : (
                      item.quantity
                    )}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap font-medium py-3 pr-8">
                    {item.quantity === 0 ? (
                      <span className="text-xs text-muted-foreground/60">—</span>
                    ) : (
                      formatCurrency(item.amount)
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 합계 */}
      <div className="flex justify-end border-t border-border pt-4">
        <div className="flex items-center gap-4 rounded-md border border-border bg-muted/40 px-6 py-3">
          <span className="text-base font-semibold">합계</span>
          <span className="text-xl font-bold whitespace-nowrap">
            {formatCurrency(invoice.totalAmount)}
          </span>
        </div>
      </div>
    </div>
  )
}
