import type { Metadata } from "next"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
  Activity,
} from "lucide-react"

export const metadata: Metadata = { title: "대시보드" }

const stats = [
  { label: "총 사용자", value: "12,345", change: "+12%", trend: "up" as const, description: "지난 달 대비", iconKey: "users" },
  { label: "월 매출", value: "₩4,523,100", change: "+8.2%", trend: "up" as const, description: "지난 달 대비", iconKey: "dollar" },
  { label: "신규 주문", value: "573", change: "-3.1%", trend: "down" as const, description: "지난 주 대비", iconKey: "cart" },
  { label: "활성 세션", value: "1,429", change: "+19%", trend: "up" as const, description: "현재 기준", iconKey: "activity" },
]

const recentOrders = [
  { id: "ORD-001", customer: "김민준", status: "완료", amount: "₩89,000", date: "2026-05-22" },
  { id: "ORD-002", customer: "이서연", status: "처리중", amount: "₩125,000", date: "2026-05-22" },
  { id: "ORD-003", customer: "박지훈", status: "완료", amount: "₩43,500", date: "2026-05-21" },
  { id: "ORD-004", customer: "최수아", status: "취소", amount: "₩67,000", date: "2026-05-21" },
  { id: "ORD-005", customer: "정도윤", status: "처리중", amount: "₩210,000", date: "2026-05-20" },
]

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  완료: "default",
  처리중: "secondary",
  취소: "destructive",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* 헤더 */}
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
              <BreadcrumbPage>대시보드</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      {/* 본문 */}
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">대시보드</h1>
          <p className="text-sm text-muted-foreground">
            서비스 현황을 한눈에 확인하세요.
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>{stat.label}</CardDescription>
                {stat.iconKey === "users" && <Users className="size-4 text-muted-foreground" />}
                {stat.iconKey === "dollar" && <DollarSign className="size-4 text-muted-foreground" />}
                {stat.iconKey === "cart" && <ShoppingCart className="size-4 text-muted-foreground" />}
                {stat.iconKey === "activity" && <Activity className="size-4 text-muted-foreground" />}
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  {stat.trend === "up" ? (
                    <TrendingUp className="size-3 text-emerald-500" />
                  ) : (
                    <TrendingDown className="size-3 text-destructive" />
                  )}
                  <span className={stat.trend === "up" ? "text-emerald-500" : "text-destructive"}>
                    {stat.change}
                  </span>
                  <span>{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 탭 섹션 */}
        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders">최근 주문</TabsTrigger>
            <TabsTrigger value="activity">활동 로그</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <p className="text-base font-semibold">최근 주문</p>
                <CardDescription>최근 5개의 주문 내역입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>주문번호</TableHead>
                      <TableHead>고객명</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead className="text-right">금액</TableHead>
                      <TableHead className="text-right">날짜</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant[order.status] ?? "outline"}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{order.amount}</TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {order.date}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <p className="text-base font-semibold">활동 로그</p>
                <CardDescription>시스템 활동 내역입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  활동 로그를 여기에 표시합니다.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
