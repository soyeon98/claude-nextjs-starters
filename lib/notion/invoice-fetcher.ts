import type { PageObjectResponse } from "@notionhq/client"
import { APIResponseError } from "@notionhq/client"
import { createNotionClient } from "@/lib/notion/client"
import { mapPageToInvoiceDetail, mapPageToInvoiceItem } from "@/lib/notion/mappers"
import type { InvoiceDetail } from "@/types"

export async function getInvoiceDetail(pageId: string): Promise<InvoiceDetail | null> {
  const notion = createNotionClient()

  try {
    const invoicePage = await notion.pages.retrieve({ page_id: pageId })

    if (!("properties" in invoicePage)) {
      return null
    }

    const relationProp = invoicePage.properties["항목"]
    const relationIds =
      relationProp?.type === "relation"
        ? relationProp.relation.map((r) => r.id)
        : []

    const itemPages = await Promise.all(
      relationIds.map((id) => notion.pages.retrieve({ page_id: id }))
    )

    const items = itemPages
      .filter((p): p is PageObjectResponse => "properties" in p)
      .map(mapPageToInvoiceItem)

    return mapPageToInvoiceDetail(invoicePage, items)
  } catch (error) {
    if (
      APIResponseError.isAPIResponseError(error) &&
      error.code === "object_not_found"
    ) {
      return null
    }
    throw error
  }
}
