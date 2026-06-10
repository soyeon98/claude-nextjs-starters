import type { Metadata } from "next"
import { InvoicePreviewClient } from "./preview-client"
import { getInvoiceDetail } from "@/lib/notion/invoice-fetcher"

export const metadata: Metadata = {
  title: "견적서 미리보기",
}

export default async function InvoicePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const invoice = await getInvoiceDetail(id)
  return <InvoicePreviewClient invoiceId={id} invoice={invoice} />
}
