"use client"

import { usePathname, useRouter } from "next/navigation"
import { useI18n } from "@/shared/lib/i18n-context"
import { Breadcrumb } from "@/shared/components/ui/breadcrumb"
import { ChevronLeft } from "lucide-react"

export function PageHeader() {
  const { t } = useI18n()
  const router = useRouter()
  const pathname = usePathname()

  const segments = pathname.split("/").filter(Boolean)
  
  if (segments.length === 0) return null

  const breadcrumbItems = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    let label = segment.charAt(0).toUpperCase() + segment.slice(1)
    if (segment === "admin") label = t("common.admin") || "Admin"
    if (segment === "users") label = t("common.users") || "Usuarios"
    if (segment === "new") label = t("common.new") || "Nuevo"
    if (segment === "projects") label = t("common.projects") || "Projects"
    return { label, href, active: index === segments.length - 1 }
  })

  return (
    <div className="flex items-center gap-4 mb-8">
      <button 
        onClick={() => router.back()} 
        className="flex shrink-0 items-center justify-center size-9 rounded-full bg-muted border border-border hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground shadow-sm"
        title="Atrás"
      >
        <ChevronLeft className="size-5" />
      </button>
      <div className="flex-1 overflow-x-auto scrollbar-none">
        <Breadcrumb items={breadcrumbItems} />
      </div>
    </div>
  )
}
