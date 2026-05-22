import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        404
      </p>
      <h1 className="text-3xl font-bold tracking-tight">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="max-w-sm text-muted-foreground">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Button asChild>
        <Link href="/">
          <Home className="size-4" />
          홈으로 돌아가기
        </Link>
      </Button>
    </div>
  )
}
