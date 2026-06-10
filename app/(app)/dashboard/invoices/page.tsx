import type { Metadata } from "next"
import { InvoicesClient } from "./invoices-client"

export const metadata: Metadata = {
  title: "견적서 목록",
}

export default function InvoicesPage() {
  return <InvoicesClient />
}
