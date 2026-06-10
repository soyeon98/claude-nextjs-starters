import type { PageObjectResponse } from "@notionhq/client"
import type { InvoiceSummary, InvoiceItem, InvoiceDetail } from "@/types"

/**
 * 노션 PageObjectResponse → InvoiceSummary 변환.
 * 속성명 '견적서 번호', '총금액'은 Invoices DB 스키마에 고정 매핑된다.
 */
export function mapPageToInvoiceSummary(page: PageObjectResponse): InvoiceSummary {
  const titleProp = page.properties["견적서 번호"]
  const title =
    titleProp?.type === "title"
      ? (titleProp.title[0]?.plain_text ?? "(제목 없음)")
      : "(제목 없음)"

  const amountProp = page.properties["총금액"]
  const amount =
    amountProp?.type === "number" ? amountProp.number : null

  const issueProp = page.properties["발행일"]
  const issueDate =
    issueProp?.type === "date" ? (issueProp.date?.start ?? null) : null

  const clientProp = page.properties["클라이언트명"]
  const clientName =
    clientProp?.type === "rich_text"
      ? (clientProp.rich_text[0]?.plain_text ?? null) || null
      : null

  const statusProp = page.properties["상태"]
  const status =
    statusProp?.type === "status" ? (statusProp.status?.name ?? null) : null

  return {
    notionPageId: page.id,
    title,
    amount,
    issueDate,
    clientName,
    status,
  }
}

export function mapPageToInvoiceItem(page: PageObjectResponse): InvoiceItem {
  const nameProp = page.properties["항목명"]
  const name =
    nameProp?.type === "title"
      ? (nameProp.title[0]?.plain_text ?? "(항목명 없음)")
      : "(항목명 없음)"

  const unitPriceProp = page.properties["단가"]
  const unitPrice =
    unitPriceProp?.type === "number" ? (unitPriceProp.number ?? 0) : 0

  const quantityProp = page.properties["수량"]
  const quantity =
    quantityProp?.type === "number" ? (quantityProp.number ?? 0) : 0

  const amountProp = page.properties["금액"]
  const amount =
    amountProp?.type === "formula" && amountProp.formula.type === "number"
      ? (amountProp.formula.number ?? 0)
      : 0

  return { id: page.id, name, unitPrice, quantity, amount }
}

export function mapPageToInvoiceDetail(
  page: PageObjectResponse,
  items: InvoiceItem[]
): InvoiceDetail {
  const titleProp = page.properties["견적서 번호"]
  const title =
    titleProp?.type === "title"
      ? (titleProp.title[0]?.plain_text ?? "(제목 없음)")
      : "(제목 없음)"

  const clientProp = page.properties["클라이언트명"]
  const clientName =
    clientProp?.type === "rich_text"
      ? (clientProp.rich_text[0]?.plain_text ?? "")
      : ""

  const issueProp = page.properties["발행일"]
  const issueDate =
    issueProp?.type === "date" ? (issueProp.date?.start ?? "") : ""

  const validProp = page.properties["유효기간"]
  const validUntil =
    validProp?.type === "date" ? (validProp.date?.start ?? "") : ""

  const amountProp = page.properties["총금액"]
  const totalAmount =
    amountProp?.type === "number" ? (amountProp.number ?? 0) : 0

  return {
    notionPageId: page.id,
    title,
    clientName,
    issueDate,
    validUntil,
    items,
    totalAmount,
  }
}
