import type { Metadata } from "next"
import { NotionSettingsClient } from "./notion-client"

export const metadata: Metadata = {
  title: "노션 연동",
}

export default function NotionSettingsPage() {
  return <NotionSettingsClient />
}
