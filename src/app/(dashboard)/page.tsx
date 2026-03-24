import { 
  Building2, 
  Plus, 
  FileText, 
  Users2, 
  TrendingUp,
  LayoutGrid,
  CalendarDays,
  ArrowUpRight
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto py-6 px-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header / Greeting */}
      <div className="flex justify-between items-end px-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Panel Principal</h1>
          <p className="text-muted-foreground font-medium mt-1">Gestión administrativa de obras</p>
        </div>
        <div className="hidden sm:block">
          <Button size="sm" className="rounded-full bg-red-600 hover:bg-red-700 h-10 px-6 font-bold shadow-lg shadow-red-600/20">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
          </Button>
        </div>
      </div>

      {/* Main Stats - Mobile App Style (Large, Simple Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2">
        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-red-600 to-red-700 text-white shadow-xl shadow-red-600/10 h-32 flex flex-col justify-center px-6 group cursor-pointer transition-all hover:scale-[1.02]">
          <div className="absolute right-[-10px] top-[-10px] opacity-10 group-hover:scale-110 transition-transform">
            <Building2 size={120} />
          </div>
          <p className="text-red-100 text-sm font-bold uppercase tracking-widest italic">Proyectos</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-4xl font-extrabold">12</h2>
            <span className="text-red-200 text-sm font-medium flex items-center">
              Activos <ArrowUpRight className="ml-1 h-3 w-3" />
            </span>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-none bg-zinc-800 text-white shadow-xl shadow-black/5 h-32 flex flex-col justify-center px-6 group cursor-pointer transition-all hover:scale-[1.02]">
          <div className="absolute right-[-10px] top-[-10px] opacity-10 group-hover:scale-110 transition-transform">
            <Users2 size={120} />
          </div>
          <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest italic">Personal</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-4xl font-extrabold">89</h2>
            <span className="text-zinc-500 text-sm font-medium">+4 hoy</span>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-none bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-black/5 h-32 flex flex-col justify-center px-6 group cursor-pointer transition-all hover:scale-[1.02]">
           <div className="absolute right-[-10px] top-[-10px] opacity-5 dark:opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp size={120} />
          </div>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest italic">Proveedores</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-4xl font-extrabold">45</h2>
            <span className="text-red-600 text-sm font-medium">3 alertas</span>
          </div>
        </Card>
      </div>

      {/* Quick Actions - Grid of Big Buttons/Cards */}
      <div className="px-2">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest italic mb-4 ml-1">Accesos Rápidos</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <QuickActionButton icon={<FileText className="text-red-600" />} label="Facturas" count="12" />
          <QuickActionButton icon={<CalendarDays className="text-zinc-600" />} label="Cronograma" />
          <QuickActionButton icon={<LayoutGrid className="text-zinc-600" />} label="Módulos" />
          <QuickActionButton icon={<TrendingUp className="text-red-600" />} label="Pagos" />
        </div>
      </div>

      {/* Recent / Activity - Simple List */}
      <div className="px-2 pb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest italic ml-1">Actividad Reciente</h3>
          <Button variant="link" className="text-red-600 font-bold p-0 h-auto">Ver Todo</Button>
        </div>
        <div className="space-y-3">
          <ActivityItem status="success" title="Proyecto Villa del Sol" desc="Presupuesto aprobado por Gerencia" time="Hace 2h" />
          <ActivityItem status="neutral" title="Proveedor Concretos S.A." desc="Nueva factura recibida para revisión" time="Hace 4h" />
          <ActivityItem status="neutral" title="Nómina Operativa" desc="Asistencia cargada para Obra Norte" time="Hace 6h" />
        </div>
      </div>
    </div>
  )
}

function QuickActionButton({ icon, label, count }: { icon: React.ReactNode, label: string, count?: string }) {
  return (
    <Button variant="outline" className="h-28 flex flex-col items-center justify-center gap-3 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-sm transition-all group">
      <div className="p-3 bg-muted rounded-full group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-center">
        <p className="font-bold text-xs">{label}</p>
        {count && <p className="text-[10px] text-red-600 font-extrabold">{count} pendientes</p>}
      </div>
    </Button>
  )
}

function ActivityItem({ status, title, desc, time }: { status: 'success' | 'alert' | 'neutral', title: string, desc: string, time: string }) {
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
      <div className={`w-2 h-10 rounded-full ${status === 'success' ? 'bg-green-500' : status === 'alert' ? 'bg-red-600' : 'bg-zinc-400'}`} />
      <div className="flex-1">
        <p className="font-bold text-sm leading-none">{title}</p>
        <p className="text-muted-foreground text-xs mt-1">{desc}</p>
      </div>
      <p className="text-[10px] font-bold text-muted-foreground">{time}</p>
    </div>
  )
}
