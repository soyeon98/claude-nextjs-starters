import { Client } from '@notionhq/client'
import { env } from '@/lib/env'

export function createNotionClient() {
  return new Client({ auth: env.notionToken })
}
