"use client"

import { useI18n } from "@/shared/lib/i18n-context"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users2, FolderKanban, ShieldCheck } from "lucide-react"
import { cn } from "@/shared/lib/utils"

interface MobileBottomNavProps {
  profile: any
}

export function MobileBottomNav({ profile }: MobileBottomNavProps) {
  const { t } = useI18n()
  const pathname = usePathname()
  const isAdmin = profile?.role === 'admin' || profile?.role === 'superadmin'

  const navItems = [
    {
      label: t("common.home"),
      icon: LayoutDashboard,
      href: "/",
      isActive: pathname === "/",
    },
    {
      label: t("common.projects"),
      icon: FolderKanban,
      href: "/projects",
      isActive: pathname.startsWith("/projects"),
    },
    {
      label: t("common.workers"),
      icon: Users2,
      href: "/workers",
      isActive: pathname.startsWith("/workers"),
    },
  ]

  if (isAdmin) {
    navItems.push({
      label: "Admin",
      icon: ShieldCheck,
      href: "/admin/users",
      isActive: pathname.startsWith("/admin"),
    })
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-background/80 backdrop-blur-xl border-t border-border pb-safe">
      <ul className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <li key={item.href} className="w-full">
            <a
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground transition-colors",
                item.isActive && "text-brand-red"
              )}
            >
              <item.icon className={cn("size-5", item.isActive && "fill-brand-red/10")} />
              <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
