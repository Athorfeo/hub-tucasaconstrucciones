import { ThemeToggle } from "@/shared/components/theme-toggle"
import { LogoutButton } from "@/features/auth/components/logout-button"
import { Building2 } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex min-h-svh flex-col xl:p-8 p-4 bg-muted/10 gap-6">
      <header className="flex justify-between items-center w-full bg-card border rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold hidden sm:block">Tu Casa Construcciones - Hub</h1>
          <h1 className="text-xl font-bold sm:hidden">Hub</h1>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LogoutButton />
        </div>
      </header>
      
      <main className="flex-1 w-full grid gap-6">
        <div className="bg-card text-card-foreground rounded-xl border p-8 shadow-sm flex flex-col items-center text-center justify-center min-h-[400px]">
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Panel de Administración Central</h2>
          <p className="text-muted-foreground max-w-[600px] text-lg">
            ¡Bienvenido al sistema! Has iniciado sesión correctamente. Aquí se integrarán progresivamente todos los módulos financieros y contables de la constructora.
          </p>
        </div>
      </main>
    </div>
  )
}
