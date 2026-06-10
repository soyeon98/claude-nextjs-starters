import { NextResponse, type NextRequest } from "next/server"
import { renderToBuffer } from "@react-pdf/renderer"
import { InvoicePdf } from "@/components/invoice/invoice-pdf"
import { getInvoiceDetail } from "@/lib/notion/invoice-fetcher"
import React from "react"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const invoice = await getInvoiceDetail(token).catch(() => null)

  if (!invoice) {
    return NextResponse.json(
      { error: "견적서를 찾을 수 없습니다." },
      { status: 404 }
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element = React.createElement(InvoicePdf, { invoice }) as any
  const buffer = await renderToBuffer(element)

  const safeTitle = invoice.title.replace(/[^a-zA-Z0-9가-힣_-]/g, "_")
  return new Response(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${safeTitle}.pdf"`,
    },
  })
}
