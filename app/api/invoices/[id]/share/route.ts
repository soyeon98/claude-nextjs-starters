import { NextResponse, type NextRequest } from "next/server"

/**
 * 공유 링크 URL 반환 (F003).
 * 노션 페이지 ID를 그대로 공개 토큰으로 사용합니다.
 * Next.js 16에서 params는 Promise 입니다.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  return NextResponse.json({ shareUrl: `${baseUrl}/view/${id}` })
}
