import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Zap, Palette, Shield, Box, Layers, Code2 } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "빠른 개발",
    description:
      "Next.js 16 + Turbopack으로 빠른 HMR과 빌드를 경험하세요.",
  },
  {
    icon: Palette,
    title: "아름다운 UI",
    description:
      "shadcn/ui 컴포넌트와 다크모드가 기본으로 탑재되어 있습니다.",
  },
  {
    icon: Shield,
    title: "타입 안전성",
    description:
      "TypeScript strict 모드와 Zod 스키마 검증으로 안전한 코드를 작성하세요.",
  },
  {
    icon: Box,
    title: "컴포넌트 라이브러리",
    description:
      "Tier 1, 2 분류된 30개 이상의 shadcn/ui 컴포넌트가 준비되어 있습니다.",
  },
  {
    icon: Layers,
    title: "레이아웃 시스템",
    description:
      "마케팅 레이아웃과 앱(대시보드) 레이아웃이 Route Group으로 분리되어 있습니다.",
  },
  {
    icon: Code2,
    title: "검증된 라이브러리",
    description:
      "React Hook Form, Zod, next-themes, sonner 등 검증된 라이브러리가 통합되어 있습니다.",
  },
]

const stats = [
  { label: "shadcn 컴포넌트", value: "28+" },
  { label: "외부 라이브러리", value: "6개" },
  { label: "페이지 템플릿", value: "4개" },
  { label: "커스텀 훅", value: "2개" },
]

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-24 text-center md:py-32">
        <Badge variant="secondary" className="gap-1.5">
          <Zap className="size-3" />
          Next.js 16 · Tailwind v4 · shadcn/ui
        </Badge>

        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          빠르게 웹 개발을{" "}
          <span className="text-muted-foreground">시작하세요</span>
        </h1>

        <p className="max-w-xl text-lg text-muted-foreground">
          모던 Next.js 스타터킷. 레이아웃, 컴포넌트, 폼, 다크모드까지
          <br className="hidden md:block" />
          모두 준비되어 있습니다. Clone하고 바로 개발을 시작하세요.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/dashboard">
              대시보드 보기 <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/settings">설정 페이지</Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="rounded-xl border border-border bg-muted/30 p-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
                <span className="text-3xl font-bold">{stat.value}</span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                {i < stats.length - 1 && (
                  <Separator
                    orientation="vertical"
                    className="absolute hidden md:block"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-4xl px-4 pb-24">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            스타터킷에 포함된 기능
          </h2>
          <p className="mt-2 text-muted-foreground">
            처음부터 구축할 필요 없이 바로 사용할 수 있습니다.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </section>
    </>
  )
}
