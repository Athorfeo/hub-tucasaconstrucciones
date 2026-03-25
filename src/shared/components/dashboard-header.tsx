"use client"

import { usePathname } from "next/navigation"
import { Breadcrumb } from "@/shared/components/ui/breadcrumb"
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { Separator } from "@/shared/components/ui/separator"
import { useI18n } from "@/shared/lib/i18n-context"
import { ThemeToggle } from "@/components/theme-toggle"

export function DashboardHeader() {
  const pathname = usePathname()
  const { t } = useI18n()

  const segments = pathname.split("/").filter(Boolean)
  const breadcrumbItems = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    // Simple mapping for labels, ideally use i18n
    let label = segment.charAt(0).toUpperCase() + segment.slice(1)
    
    // Custom mapping for known routes
    if (segment === "admin") label = t("common.admin")
    if (segment === "users") label = t("common.users")
    if (segment === "projects") label = t("common.projects")
    
    return {
      label,
      href,
      active: index === segments.length - 1
    }
  })

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-border px-4 bg-background/80 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-2 flex-1">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
        <Separator orientation="vertical" className="mr-2 h-4 bg-border" />
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  )
}
