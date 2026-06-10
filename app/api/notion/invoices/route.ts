import { NextResponse, type NextRequest } from "next/server"
import type { PageObjectResponse } from "@notionhq/client"
import { APIResponseError } from "@notionhq/client"
import { createNotionClient } from "@/lib/notion/client"
import { env } from "@/lib/env"
import { mapPageToInvoiceSummary } from "@/lib/notion/mappers"

export async function GET(_request: NextRequest) {
  try {
    const notion = createNotionClient()
    const response = await notion.dataSources.query({
      data_source_id: env.notionDatabaseId,
      page_size: 100,
      sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
    })

    const pages = response.results.filter(
      (r): r is PageObjectResponse => r.object === "page" && "properties" in r
    )
    const invoices = pages.map(mapPageToInvoiceSummary)

    return NextResponse.json(invoices)
  } catch (error) {
    if (APIResponseError.isAPIResponseError(error)) {
      switch (error.code) {
        case "unauthorized":
          return NextResponse.json(
            { error: "노션 API 키가 유효하지 않습니다." },
            { status: 401 }
          )
        case "object_not_found":
          return NextResponse.json(
            { error: "데이터베이스를 찾을 수 없습니다. NOTION_DATABASE_ID를 확인하세요." },
            { status: 404 }
          )
        case "restricted_resource":
          return NextResponse.json(
            { error: "데이터베이스 접근 권한이 없습니다. 노션 연동 설정을 확인하세요." },
            { status: 403 }
          )
        case "rate_limited":
          return NextResponse.json(
            { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
            { status: 429 }
          )
        default:
          return NextResponse.json(
            { error: "노션 API 오류가 발생했습니다." },
            { status: 500 }
          )
      }
    }

    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
