"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Eye, Link2, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import type { InvoiceSummary } from "@/types"

const STATUS_STYLE: Record<string, string> = {
  대기:    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  진행중:  "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  완료:    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  취소:    "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
}

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_STYLE[status] ?? "bg-muted text-muted-foreground"
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {status}
    </span>
  )
}

export function InvoicesClient() {
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const res = await fetch("/api/notion/invoices")
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? "견적서를 불러오지 못했습니다.")
      }
      const data = await res.json()
      setInvoices(data)
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  function handleRefresh() {
    fetchInvoices()
  }

  async function handleCopyShareLink(notionPageId: string) {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/view/${notionPageId}`
      )
      toast.success("공유 링크가 복사되었습니다.")
    } catch {
      toast.error("복사에 실패했습니다.")
    }
  }

  function formatAmount(amount: number | null): string {
    if (amount === null) return "—"
    return `₩${amount.toLocaleString("ko-KR")}`
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
              <BreadcrumbLink href="/">홈</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>견적서</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      {/* 본문 */}
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* 페이지 제목 + 새로고침 버튼 */}
        <div className="mx-auto w-full max-w-4xl flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">견적서</h1>
            <p className="text-sm text-muted-foreground">
              노션에서 작성한 견적서를 확인하고 공유 링크를 관리하세요.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="shrink-0 self-start shadow-sm"
          >
            <RefreshCw
              className={`size-4 ${isLoading ? "animate-spin" : ""}`}
            />
            새로고침
          </Button>
        </div>

        {/* 견적서 목록 테이블 */}
        <Card className="mx-auto w-full max-w-4xl shadow-sm">
          <CardHeader>
            <h2 className="font-semibold">견적서 목록</h2>
            <CardDescription>
              노션 데이터베이스에서 불러온 견적서입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <TooltipProvider delayDuration={300}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center font-bold text-foreground">견적서 번호</TableHead>
                      <TableHead className="text-center font-bold text-foreground whitespace-nowrap">
                        총금액
                      </TableHead>
                      <TableHead className="text-center font-bold text-foreground whitespace-nowrap">
                        상태
                      </TableHead>
                      <TableHead className="text-center font-bold text-foreground whitespace-nowrap">
                        최종 수정일
                      </TableHead>
                      <TableHead className="text-center font-bold text-foreground">작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="py-12 text-center text-sm text-muted-foreground"
                        >
                          불러오는 중...
                        </TableCell>
                      </TableRow>
                    ) : errorMessage ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="py-12 text-center text-sm text-muted-foreground"
                        >
                          {errorMessage}
                          <div className="mt-3">
                            <Button variant="outline" size="sm" onClick={fetchInvoices}>
                              다시 시도
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : invoices.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="py-12 text-center text-sm text-muted-foreground"
                        >
                          견적서가 없습니다.
                          <div className="mt-3">
                            <Button asChild variant="outline" size="sm">
                              <Link href="/settings/notion">노션 연동 설정</Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      invoices.map((invoice) => (
                        <TableRow key={invoice.notionPageId}>
                          <TableCell className="text-center font-medium">
                            {invoice.title}
                          </TableCell>
                          <TableCell className="text-center whitespace-nowrap tabular-nums">
                            {formatAmount(invoice.amount)}
                          </TableCell>
                          <TableCell className="text-center whitespace-nowrap">
                            {invoice.status ? (
                              <StatusBadge status={invoice.status} />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center whitespace-nowrap tabular-nums text-muted-foreground">
                            {format(new Date(invoice.lastEditedAt), "yyyy-MM-dd")}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    asChild
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                  >
                                    <Link
                                      href={`/dashboard/invoices/${invoice.notionPageId}/preview`}
                                    >
                                      <Eye className="size-4" />
                                      <span className="sr-only">미리보기</span>
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>미리보기</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                    onClick={() =>
                                      handleCopyShareLink(invoice.notionPageId)
                                    }
                                  >
                                    <Link2 className="size-4" />
                                    <span className="sr-only">공유 링크 복사</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>공유 링크 복사</TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
