"use client"

import * as React from "react"
import { 
  Building2, 
  Users2, 
  UserRound, 
  LayoutDashboard, 
  FolderKanban, 
  PieChart, 
  CalendarDays,
  LogOut,
  ChevronRight,
  ShieldCheck,
  UserCog,
  Languages,
  Plus,
  Landmark,
  Contact
} from "lucide-react"

import { useI18n } from "@/shared/lib/i18n-context"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarRail,
} from "@/components/ui/sidebar"
import { logout } from "@/features/auth/actions"
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible"

export function AppSidebar({ profile, ...props }: React.ComponentProps<typeof Sidebar> & { profile: any }) {
  const { t, locale, setLocale } = useI18n()
  const isAdmin = profile?.role === 'admin' || profile?.role === 'superadmin'

  const navigationData = {
    management: [
      { title: t("common.directory"), url: "/users", icon: Contact },
    ],
    projects: [
      { title: t("common.list"), url: "/projects", icon: FolderKanban },
      { title: t("common.budgets"), url: "/budgets", icon: PieChart },
      { title: t("common.timelines"), url: "/timelines", icon: CalendarDays },
    ],
    admin: [
      { title: t("common.profiles"), url: "/admin/profiles", icon: UserCog },
      { title: t("common.banks"), url: "/admin/banks", icon: Landmark },
    ]
  }

  const user = {
    name: profile?.full_name || profile?.email?.split('@')[0] || t("common.staff"),
    email: profile?.email || "No email",
    avatar: "/avatars/user.jpg",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-white/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="/" />} className="hover:bg-transparent">
              <div className="flex aspect-square size-8 items-center justify-center rounded-[0.6rem] bg-zinc-900 border border-white/5 shadow-xl group-data-[collapsible=icon]:size-10">
              <div className="size-3 rounded-full bg-brand-red animate-pulse shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
            </div>
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate font-black text-lg uppercase tracking-tighter">
                Hub<span className="text-brand-red">.</span>
              </span>
              <span className="truncate text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-500">Construction Mgmt</span>
            </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<a href="/" />} tooltip={t("common.home")} className="font-bold py-6 hover:bg-white/5 transition-colors">
                <LayoutDashboard className="!size-5" />
                <span>{t("common.home")}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 px-4 mb-2">
            {t("common.management")}
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1 mt-1">
            {navigationData.management.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton render={<a href={item.url} />} tooltip={item.title} className="h-10 rounded-xl px-4 hover:bg-white hover:text-black transition-all font-bold">
                  <item.icon className="!size-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 px-4 mb-2">
            {t("common.projects")}
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1 mt-1">
            {navigationData.projects.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton render={<a href={item.url} />} tooltip={item.title} className="h-10 rounded-xl px-4 hover:bg-white hover:text-black transition-all font-bold">
                  <item.icon className="!size-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 px-4 mb-2">
              {t("common.staff_management")}
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1 mt-1">
              {navigationData.admin.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<a href={item.url} />} tooltip={item.title} className="h-10 rounded-xl px-4 hover:bg-white hover:text-black transition-all font-bold">
                    <item.icon className="!size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-white/5 p-4">
        <SidebarMenu className="gap-3">
          <SidebarMenuItem>
             <div className="flex items-center justify-between px-2 mb-2">
               <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Language</span>
               <div className="flex gap-1">
                 <button
                  onClick={() => setLocale("es")}
                  className={`text-[10px] font-bold px-2 py-1 rounded-md transition-all ${locale === 'es' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                 >
                   ES
                 </button>
                 <button
                  onClick={() => setLocale("en")}
                  className={`text-[10px] font-bold px-2 py-1 rounded-md transition-all ${locale === 'en' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                 >
                   EN
                 </button>
               </div>
             </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-900 border border-white/5">
              <div className="size-8 rounded-full bg-white flex items-center justify-center text-black text-xs font-black">
                {user.name[0].toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold truncate text-white">{user.name}</span>
                <span className="text-[10px] text-zinc-500 font-bold truncate uppercase tracking-tighter">{profile?.role || "No Role"}</span>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <form action={logout}>
              <SidebarMenuButton type="submit" className="text-zinc-400 hover:text-white hover:bg-white/5 font-bold h-10 rounded-xl">
                <LogOut className="size-4" />
                <span>{t("common.logout")}</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
