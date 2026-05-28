import type { Metadata } from "next"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { FileText, BookOpen, Code2, Layers } from "lucide-react"

export const metadata: Metadata = { title: "문서" }

const docs = [
  {
    icon: BookOpen,
    title: "시작하기",
    description: "프로젝트 설치 및 기본 설정 방법을 안내합니다.",
    badge: "필독",
  },
  {
    icon: Layers,
    title: "레이아웃 시스템",
    description: "마케팅 레이아웃과 앱 레이아웃의 구조를 설명합니다.",
    badge: "가이드",
  },
  {
    icon: Code2,
    title: "컴포넌트 목록",
    description: "사용 가능한 shadcn/ui 컴포넌트 목록과 예제를 확인하세요.",
    badge: "레퍼런스",
  },
  {
    icon: FileText,
    title: "API 레퍼런스",
    description: "유틸리티 함수 및 훅에 대한 상세 API 문서입니다.",
    badge: "레퍼런스",
  },
]

export default function DocsPage() {
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
              <BreadcrumbPage>문서</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">문서</h1>
          <p className="text-sm text-muted-foreground">
            스타터킷 사용 가이드 및 레퍼런스 문서입니다.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {docs.map((doc) => {
            const Icon = doc.icon
            return (
              <Card key={doc.title} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="mb-2 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <Badge variant="secondary">{doc.badge}</Badge>
                  </div>
                  <CardTitle className="text-base">{doc.title}</CardTitle>
                  <CardDescription>{doc.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
