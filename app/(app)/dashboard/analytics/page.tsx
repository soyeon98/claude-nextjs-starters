import type { Metadata } from "next"
import {
  Card,
  CardContent,
  CardDescription,
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
import { TrendingUp, Users, Eye, MousePointer } from "lucide-react"

export const metadata: Metadata = { title: "분석" }

const metrics = [
  { label: "페이지 조회수", value: "84,320", change: "+15.2%", icon: Eye },
  { label: "순 방문자", value: "23,541", change: "+9.8%", icon: Users },
  { label: "클릭률", value: "4.7%", change: "+0.3%p", icon: MousePointer },
  { label: "전환율", value: "2.1%", change: "+0.8%p", icon: TrendingUp },
]

export default function AnalyticsPage() {
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
              <BreadcrumbLink href="/dashboard">대시보드</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>분석</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">분석</h1>
          <p className="text-sm text-muted-foreground">
            트래픽 및 사용자 행동 데이터를 확인하세요.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <Card key={metric.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardDescription>{metric.label}</CardDescription>
                  <Icon className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="mt-1 text-xs text-emerald-500">{metric.change} 지난 달 대비</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card>
          <CardHeader>
            <p className="text-base font-semibold">상세 분석</p>
            <CardDescription>차트 및 상세 분석 데이터가 여기에 표시됩니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
              분석 차트 영역
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
