"use client"

// 전역 에러 바운더리 — 루트 레이아웃 하위의 예상치 못한 에러를 처리합니다.
// 레이아웃(헤더/푸터/사이드바) 없이 독립적으로 렌더되므로 자체 완결 UI를 제공합니다.

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, Home, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  // 에러를 콘솔에 기록하여 디버깅을 돕습니다
  useEffect(() => {
    console.error("[GlobalError]", error)
  }, [error])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-4 py-24 text-center">
      {/* 에러 아이콘 */}
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-8 text-destructive" />
      </div>

      {/* 에러 설명 */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          오류 발생
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          문제가 발생했습니다
        </h1>
        <p className="max-w-sm text-muted-foreground">
          예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>

        {/* 개발 환경에서만 상세 에러 메시지 표시 */}
        {process.env.NODE_ENV === "development" && error?.message && (
          <p className="mt-1 max-w-md rounded-md bg-muted px-3 py-2 text-left font-mono text-xs text-muted-foreground">
            {error.message}
          </p>
        )}

        {/* digest가 있을 경우 지원팀 문의용으로 표시 */}
        {error?.digest && (
          <p className="text-xs text-muted-foreground/60">
            오류 코드: {error.digest}
          </p>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={reset} variant="default">
          <RotateCcw className="size-4" />
          다시 시도
        </Button>
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="size-4" />
            홈으로 돌아가기
          </Link>
        </Button>
      </div>
    </div>
  )
}
