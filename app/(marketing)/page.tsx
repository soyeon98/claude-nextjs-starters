import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { ArrowRight, FileText, Link2, FileDown } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "노션에서 작성",
    description:
      "익숙한 노션에서 견적서를 작성하세요. 별도의 에디터를 배울 필요가 없습니다.",
  },
  {
    icon: Link2,
    title: "URL로 공유",
    description:
      "클릭 한 번으로 공유 링크를 만들어 클라이언트에게 전달하세요. 가입은 필요 없습니다.",
  },
  {
    icon: FileDown,
    title: "PDF 다운로드",
    description:
      "클라이언트가 견적서를 웹에서 보고 PDF로 바로 내려받을 수 있습니다.",
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 text-center md:py-32">
        {/* 배경 그라디언트 — 전체 너비 */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent" />

        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4">
          <Badge variant="secondary" className="gap-1.5 border border-border/50 shadow-sm">
            <FileText className="size-3" />
            노션 기반 견적서 공유
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            견적서,{" "}
            <span className="bg-gradient-to-br from-foreground via-foreground/80 to-foreground/50 bg-clip-text text-transparent">
              링크로 공유하세요
            </span>
          </h1>

          <p className="max-w-xl text-lg text-muted-foreground">
            노션에서 작성한 견적서를 클라이언트가 가입 없이 웹에서 확인하고
            <br className="hidden md:block" />
            PDF로 다운로드할 수 있습니다.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="shadow-sm">
              <Link href="/dashboard/invoices">
                시작하기 <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="shadow-sm">
              <Link href="/settings/notion">노션 연동</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-4xl px-4 pb-24">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            세 단계로 끝나는 견적서 공유
          </h2>
          <p className="mt-2 text-muted-foreground">
            작성부터 전달까지, 가장 간단한 방법.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="group border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardHeader>
                  <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
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
