"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useI18n } from "@/shared/lib/i18n-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  Search,
  LayoutDashboard,
  FolderKanban,
  Users2,
  Building2,
  UserCog,
  LogOut,
  Landmark,
  Contact
} from "lucide-react"

import { logout } from "@/features/auth/actions"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/shared/components/ui/command"

import { Breadcrumb } from "@/shared/components/ui/breadcrumb"
import { ChevronLeft } from "lucide-react"

export function DashboardHeader({ profile }: { profile: any }) {
  const { t, locale, setLocale } = useI18n()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const [showUserMenu, setShowUserMenu] = React.useState(false)

  const isAdmin = profile?.role === 'admin' || profile?.role === 'superadmin'
  const userInitial = profile?.full_name ? profile.full_name[0].toUpperCase() : (profile?.email ? profile.email[0].toUpperCase() : "U")

  // Breadcrumbs Logic
  const segments = pathname.split("/").filter(Boolean)
  const breadcrumbItems = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    let label = segment.charAt(0).toUpperCase() + segment.slice(1)
    if (segment === "admin") label = t("common.admin") || "Admin"
    if (segment === "users") label = t("common.profiles") || "Users"
    if (segment === "projects") label = t("common.projects") || "Projects"
    return { label, href, active: index === segments.length - 1 }
  })

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  // Cierra menús cuando la ruta cambia (como al darle 'Atrás')
  React.useEffect(() => {
    setOpen(false)
    setShowUserMenu(false)
  }, [pathname])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 z-40 flex items-center justify-between px-4 md:px-8 border-b border-white/5 bg-background/60 backdrop-blur-2xl">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3 group hover:opacity-80 transition-opacity">
          <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 shadow-lg shadow-black/50 group-hover:shadow-brand-red/20 transition-all">
            <div className="size-3.5 rounded-full bg-brand-red shadow-[0_0_15px_rgba(255,0,0,0.6)] animate-pulse" />
          </div>
          <div className="hidden md:grid flex-1 text-left leading-tight">
            <span className="truncate font-black text-2xl tracking-tighter text-foreground bg-clip-text">
              Hub<span className="text-brand-red">.</span>
            </span>
          </div>
        </Link>

        {/* Middle: Command Palette Trigger */}
        <div className="flex-1 max-w-lg mx-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="size-4 text-muted-foreground" />
          </div>
          <button 
            onClick={() => setOpen(true)}
            className="w-full h-10 flex items-center justify-between pl-10 pr-3 bg-muted/30 hover:bg-muted/50 border border-white/5 hover:border-white/10 rounded-2xl transition-all text-muted-foreground ring-1 ring-transparent hover:ring-white/10 shadow-sm"
          >
            <span className="text-[11px] font-bold uppercase tracking-widest text-left">
              {t("common.search") || "Buscador Global..."}
            </span>
            <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded bg-black/20 px-1.5 font-mono text-[10px] font-bold text-muted-foreground border border-white/5">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-3 md:gap-4 relative">
          <ThemeToggle />
          
          <div 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-muted/40 border border-white/5 cursor-pointer hover:bg-muted/80 transition-colors backdrop-blur-md"
          >
            <div className="size-8 md:size-7 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-black shadow-inner">
              {userInitial}
            </div>
            <span className="hidden md:inline-block text-[10px] font-black uppercase tracking-widest truncate max-w-[120px] text-foreground/90">
              {profile?.full_name || profile?.email?.split('@')[0]}
            </span>
          </div>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-2xl shadow-2xl z-50 p-1 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2">
                
                {/* Language Switcher */}
                <div className="p-2 border-b border-border/50 mb-1">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2 px-1">Idioma / Language</p>
                  <div className="flex bg-muted rounded-lg p-1">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setLocale('es'); }}
                      className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all ${locale === 'es' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      ES
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setLocale('en'); }}
                      className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all ${locale === 'en' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      EN
                    </button>
                  </div>
                </div>

                <button 
                  onClick={async () => {
                    await logout()
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-brand-red hover:bg-brand-red/10 rounded-xl transition-colors text-left"
                >
                  <LogOut className="size-4" />
                  {t("common.logout")}
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Command Palette Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="bg-zinc-950/95 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <CommandInput 
            placeholder="Escribe un comando o destino..." 
            className="h-14 font-medium text-sm border-b border-white/5 bg-transparent px-4 focus:ring-0" 
          />
          <CommandList className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent p-2">
            <CommandEmpty className="py-12 text-center text-xs font-bold uppercase tracking-wides text-muted-foreground/50">
              No se encontraron resultados
            </CommandEmpty>
            
            <CommandGroup heading="Plataforma" className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 px-2 py-3">
              <CommandItem className="h-12 rounded-xl mb-1 cursor-pointer transition-colors aria-selected:bg-white/5 aria-selected:text-foreground" onSelect={() => runCommand(() => router.push("/"))}>
                <LayoutDashboard className="mr-3 size-4 text-muted-foreground group-aria-selected:text-foreground" />
                <span className="font-semibold text-sm">Inicio / Dashboard</span>
              </CommandItem>
              <CommandItem className="h-12 rounded-xl mb-1 cursor-pointer transition-colors aria-selected:bg-white/5 aria-selected:text-foreground" onSelect={() => runCommand(() => router.push("/projects"))}>
                <FolderKanban className="mr-3 size-4 text-muted-foreground group-aria-selected:text-foreground" />
                <span className="font-semibold text-sm">Mis Proyectos</span>
              </CommandItem>
            </CommandGroup>
            
            <CommandSeparator className="bg-white/5 my-1 mx-2" />
            
            <CommandGroup heading="Gestión y Directorios" className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 px-2 py-3">
              <CommandItem className="h-12 rounded-xl mb-1 cursor-pointer transition-colors aria-selected:bg-white/5 aria-selected:text-foreground" onSelect={() => runCommand(() => router.push("/users"))}>
                <Contact className="mr-3 size-4 text-muted-foreground group-aria-selected:text-foreground" />
                <span className="font-semibold text-sm">Usuarios</span>
              </CommandItem>
            </CommandGroup>

            {isAdmin && (
              <>
                <CommandSeparator className="bg-white/5 my-1 mx-2" />
                <CommandGroup heading="Seguridad y Sistema" className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 px-2 py-3">
                  <CommandItem className="h-12 rounded-xl mb-1 cursor-pointer transition-colors aria-selected:bg-brand-red/10 aria-selected:text-brand-red" onSelect={() => runCommand(() => router.push("/admin/profiles"))}>
                    <UserCog className="mr-3 size-4 text-brand-red/70 group-aria-selected:text-brand-red" />
                    <span className="font-semibold text-sm text-brand-red/90 group-aria-selected:text-brand-red">Control de Accesos (IAM)</span>
                  </CommandItem>
                  <CommandItem className="h-12 rounded-xl cursor-pointer transition-colors aria-selected:bg-white/5 aria-selected:text-foreground" onSelect={() => runCommand(() => router.push("/admin/banks"))}>
                    <Landmark className="mr-3 size-4 text-muted-foreground group-aria-selected:text-foreground" />
                    <span className="font-semibold text-sm text-muted-foreground group-aria-selected:text-foreground">Bancos</span>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
