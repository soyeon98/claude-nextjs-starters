import type { Metadata } from "next"
import { InvoiceDetailClient } from "./invoice-detail-client"
import { getInvoiceDetail } from "@/lib/notion/invoice-fetcher"

export const metadata: Metadata = {
  title: "견적서 상세",
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const invoice = await getInvoiceDetail(id)
  return <InvoiceDetailClient invoiceId={id} invoice={invoice} />
}
