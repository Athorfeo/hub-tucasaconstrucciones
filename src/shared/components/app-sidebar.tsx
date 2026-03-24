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
  ChevronRight
} from "lucide-react"

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

const data = {
  user: {
    name: "Administrador",
    email: "admin@tucasaconstrucciones.com",
    avatar: "/avatars/admin.jpg",
  },
  management: [
    { title: "Proveedores", url: "/proveedores", icon: Building2 },
    { title: "Socios", url: "/socios", icon: UserRound },
    { title: "Trabajadores", url: "/trabajadores", icon: Users2 },
  ],
  projects: [
    { title: "Listado", url: "/proyectos", icon: FolderKanban },
    { title: "Presupuestos", url: "/presupuestos", icon: PieChart },
    { title: "Cronogramas", url: "/cronogramas", icon: CalendarDays },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-red-600 text-sidebar-primary-foreground">
                <Building2 className="size-5" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold tracking-tight">Tu Casa Construcciones</span>
                <span className="truncate text-xs text-muted-foreground italic">Hub Central</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<a href="/" />} tooltip="Inicio" className="font-bold py-6">
                <LayoutDashboard className="!size-5" />
                <span>Inicio</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase font-extrabold tracking-widest text-red-600/50 italic px-4">
            Gestión
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1 mt-1">
            {data.management.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton render={<a href={item.url} />} tooltip={item.title} className="h-10 rounded-xl px-4 hover:bg-red-500/5 hover:text-red-500 transition-all font-medium">
                  <item.icon className="!size-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase font-extrabold tracking-widest text-zinc-500/50 italic px-4">
            Proyectos
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1 mt-1">
            {data.projects.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton render={<a href={item.url} />} tooltip={item.title} className="h-10 rounded-xl px-4 hover:bg-zinc-500/5 transition-all font-medium">
                  <item.icon className="!size-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={logout}>
              <SidebarMenuButton type="submit" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30">
                <LogOut className="size-4" />
                <span>Cerrar Sesión</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
