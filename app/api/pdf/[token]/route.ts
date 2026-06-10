import { NextResponse, type NextRequest } from "next/server"

/**
 * PDF 스트림 생성 (F005).
 * 공개 토큰으로 견적서를 조회해 PDF로 렌더링하여 스트림으로 반환합니다.
 * Next.js 16에서 params는 Promise 입니다.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  // TODO: token으로 SharedInvoice(is_active) 조회 → 노션 내용 → @react-pdf/renderer로 PDF 생성
  return NextResponse.json(
    { error: "아직 구현되지 않았습니다.", token },
    { status: 501 }
  )
}
