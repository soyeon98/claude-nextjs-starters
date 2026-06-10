"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  LayoutDashboard,
  FileText,
  Settings,
  Plug,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const iconMap: Record<string, React.ReactNode> = {
  home: <Home />,
  dashboard: <LayoutDashboard />,
  fileText: <FileText />,
  plug: <Plug />,
  settings: <Settings />,
}

interface NavGroup {
  label?: string
  items: {
    label: string
    href: string
    iconKey?: string
    badge?: string | number
    disabled?: boolean
  }[]
}

interface NavMainProps {
  groups: NavGroup[]
}

export function NavMain({ groups }: NavMainProps) {
  const pathname = usePathname()

  return (
    <>
      {groups.map((group, i) => (
        <SidebarGroup key={i}>
          {group.label && (
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive = pathname === item.href

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(item.disabled && "pointer-events-none opacity-50")}
                    >
                      <Link href={item.href}>
                        {item.iconKey && iconMap[item.iconKey]}
                        <span>{item.label}</span>
                        {item.badge !== undefined && (
                          <span className="ml-auto text-xs font-medium text-muted-foreground">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
