import { AppSidebar } from "@/components/app-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { getProfile } from "@/features/auth/queries"

import { DashboardHeader } from "@/shared/components/dashboard-header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getProfile()

  return (
    <SidebarProvider>
      <AppSidebar profile={profile} />
      <SidebarInset className="bg-background">
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:p-10 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
