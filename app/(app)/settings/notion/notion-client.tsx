"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { Badge } from "@/components/ui/badge"

type Status = "idle" | "loading" | "ok" | "error"

export function NotionSettingsClient() {
  const [status, setStatus] = useState<Status>("idle")

  const handleTest = async () => {
    setStatus("loading")
    const res = await fetch("/api/notion/verify")
    const data = await res.json()
    if (data.ok) {
      setStatus("ok")
      toast.success("노션 연동이 정상입니다.")
    } else {
      setStatus("error")
      toast.error("노션 연동 실패: " + (data.error ?? "알 수 없는 오류"))
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">홈</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>노션 연동</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">노션 연동</h1>
          <p className="text-sm text-muted-foreground">
            현재 연동된 노션 데이터베이스 상태를 확인하세요.
          </p>
        </div>

        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>연동 상태</CardTitle>
            <CardDescription>
              서버에 설정된 노션 Integration으로 연결 상태를 확인합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === "ok" && <Badge variant="default">연동 정상</Badge>}
            {status === "error" && (
              <Badge variant="destructive">연동 실패</Badge>
            )}
            {status === "idle" && (
              <p className="text-sm text-muted-foreground">
                아직 확인하지 않았습니다.
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleTest} disabled={status === "loading"}>
              {status === "loading" ? "확인 중..." : "연동 테스트"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
