import { NextResponse } from "next/server"
import { createNotionClient } from "@/lib/notion/client"
import { env } from "@/lib/env"

export async function GET() {
  try {
    const notion = createNotionClient()
    await notion.databases.retrieve({ database_id: env.notionDatabaseId })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "연결 실패" },
      { status: 200 }
    )
  }
}
