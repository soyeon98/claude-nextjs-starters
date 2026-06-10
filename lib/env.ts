/**
 * 환경 변수 접근 헬퍼.
 * 필수 환경 변수가 누락된 경우 명확한 에러를 던져 디버깅을 돕습니다.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`환경 변수 ${name} 가 설정되지 않았습니다. .env.local 을 확인하세요.`)
  }
  return value
}

export const env = {
  // 공개 견적서 뷰의 절대 URL 생성에 사용하는 사이트 기본 URL
  get appUrl() {
    return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  },
  // 노션 API Key (서버 전용, 절대 클라이언트 노출 금지)
  get notionToken() {
    return required("NOTION_API_KEY", process.env.NOTION_API_KEY)
  },
  // 견적서가 저장된 노션 데이터베이스 ID (서버 전용)
  get notionDatabaseId() {
    return required("NOTION_DATABASE_ID", process.env.NOTION_DATABASE_ID)
  },
}
