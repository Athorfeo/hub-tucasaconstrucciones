import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { getProfile } from "@/features/auth/queries"
import { PageHeader } from "@/shared/components/page-header"
import { DashboardHeader } from "@/shared/components/dashboard-header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getProfile()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader profile={profile} />
      
      {/* Añadimos margin-top para compensar el header flotante, y margin-bottom en móvil para la barra inferior */}
      <main className="flex-1 w-full max-w-7xl mx-auto pt-24 pb-20 md:pb-10 px-4">
        <PageHeader />
        {children}
      </main>
      
      <MobileBottomNav profile={profile} />
    </div>
  )
}
