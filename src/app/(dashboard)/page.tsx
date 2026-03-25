"use client"

import { Card } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { useI18n } from "@/shared/lib/i18n-context"
import { createClient } from "@/shared/supabase/client"
import { useEffect, useState, useCallback } from "react"
import { ProjectList } from "@/features/projects/components/project-list"
import { EditRoleDialog } from "@/features/admin/components/edit-role-dialog"
import { 
  Users2, 
  UserCog,
  Settings,
  ShieldAlert,
  ChevronRight,
  LayoutGrid,
  FileText,
  CalendarDays
} from "lucide-react"

export default function DashboardPage() {
  const { t } = useI18n()
  const [profile, setProfile] = useState<any>(null)

  const loadProfile = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(data)
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto py-6 px-4 animate-in fade-in duration-700">
      {/* Top Section: Header (Minimal) */}
      <div className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em] mt-2">{t("dashboard.subtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* RIGHT Column (Projects) first on mobile, then LG 7/12 */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <ProjectList />
        </div>

        {/* LEFT Column (Management) second on mobile, then LG 5/12 */}
        <div className="lg:col-span-5 order-2 lg:order-1 space-y-10">
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] ml-1">{t("common.management")}</h3>
            <Card className="border border-border bg-card/50 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-3xl">
              <div className="absolute right-0 top-0 size-40 bg-brand-red opacity-[0.03] blur-3xl pointer-events-none" />
              <div className="flex items-center gap-6 mb-8">
                <div className="flex aspect-square size-16 items-center justify-center rounded-2xl bg-card border border-border shadow-2xl relative">
                  <Users2 className="size-7 text-foreground" />
                  <div className="absolute -top-1 -right-1 size-3.5 rounded-full bg-brand-red border-4 border-card shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black uppercase tracking-tight text-foreground">{profile?.full_name || '...'}</h2>
                    {profile && (
                      <EditRoleDialog 
                        userId={profile.id}
                        email={profile.email}
                        currentRole={profile.role}
                        userName={profile.full_name}
                        onUpdate={loadProfile}
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight italic">{profile?.email}</p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[8px] font-black uppercase tracking-widest">{profile?.role || '...'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Management Actions (Menu Style) */}
              <div className="pt-4 border-t border-border">
                <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.3em] mb-4 px-2">Opciones de Sistema</p>
                <div className="space-y-2">
                  <MenuActionItem 
                    icon={<UserCog className="size-4" />} 
                    title={t("common.users")} 
                    desc="Administrar equipo y accesos"
                    href="/admin/users"
                    show={profile?.role === 'superadmin' || profile?.role === 'admin'}
                  />
                  <MenuActionItem 
                    icon={<ShieldAlert className="size-4" />} 
                    title="Seguridad" 
                    desc="Políticas y registros"
                    href="/admin/security"
                    show={profile?.role === 'superadmin'}
                  />
                  <MenuActionItem 
                    icon={<LayoutGrid className="size-4" />} 
                    title="Módulos" 
                    desc="Gestión de funcionalidades"
                    href="/admin/modules"
                    show={profile?.role === 'superadmin'}
                  />
                  <MenuActionItem 
                    icon={<Settings className="size-4" />} 
                    title="Configuración" 
                    desc="Ajustes del sistema"
                    href="/settings"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Secondary Info Area (Activity placeholder or other) */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] ml-1">General</h3>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-6 rounded-3xl bg-card/30 border border-border space-y-2">
                  <FileText className="size-4 text-muted-foreground" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Documentos</p>
                  <p className="text-2xl font-black tabular-nums">12</p>
               </div>
               <div className="p-6 rounded-3xl bg-card/30 border border-border space-y-2">
                  <CalendarDays className="size-4 text-muted-foreground" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Eventos</p>
                  <p className="text-2xl font-black tabular-nums">04</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Projects (7/12) */}
        <div className="lg:col-span-7">
          <ProjectList />
        </div>
      </div>
    </div>
  )
}

function MenuActionItem({ icon, title, desc, href, show = true }: { icon: React.ReactNode, title: string, desc: string, href: string, show?: boolean }) {
  if (!show) return null

  return (
    <a href={href} className="group/item flex items-center justify-between p-4 rounded-2xl hover:bg-foreground hover:text-background transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="size-10 rounded-xl bg-background flex items-center justify-center border border-border group-hover/item:bg-background group-hover/item:border-transparent transition-colors">
          <div className="text-muted-foreground group-hover/item:text-foreground transition-colors">
            {icon}
          </div>
        </div>
        <div className="space-y-0.5 whitespace-nowrap overflow-hidden">
          <p className="font-black text-[10px] uppercase tracking-widest text-muted-foreground group-hover/item:text-background transition-colors truncate">{title}</p>
          <p className="text-[9px] font-bold text-muted-foreground/60 group-hover/item:text-background/70 transition-colors uppercase tracking-tight truncate">{desc}</p>
        </div>
      </div>
      <ChevronRight className="size-4 text-muted-foreground group-hover/item:text-brand-red transition-all group-hover/item:translate-x-1" />
    </a>
  )
}
