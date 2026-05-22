export interface NavItem {
  label: string
  href: string
  external?: boolean
  disabled?: boolean
}

export interface SidebarItem extends NavItem {
  iconKey?: string
  badge?: string | number
}

export interface SidebarGroup {
  label?: string
  items: SidebarItem[]
}

export interface SiteConfig {
  name: string
  description: string
  url: string
  nav: NavItem[]
  footer: NavItem[]
}
