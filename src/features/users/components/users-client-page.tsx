"use client"

import React, { useState, useDeferredValue, useMemo } from "react"
import { useRouter } from "next/navigation"
import { UserWithAccounts } from "@/features/users/queries"
import { Bank } from "@/features/banks/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Contact, FileText, DownloadCloud, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useI18n } from "@/shared/lib/i18n-context"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"

export function UsersClientPage({ initialUsers, activeBanks }: { initialUsers: UserWithAccounts[], activeBanks: Bank[] }) {
  const { t } = useI18n()
  const router = useRouter()
  const [users, setUsers] = useState<UserWithAccounts[]>(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const deferredSearchQuery = useDeferredValue(searchQuery)
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 15

  // Pre-compute lowercased strings for hyper-fast searching
  const usersWithSearchString = useMemo(() => {
    return users.map(u => ({
      ...u,
      _searchString: `${u.name} ${u.document_number} ${u.phone || ''} ${(u as any).email || ''}`.toLowerCase()
    }))
  }, [users])

  const filteredUsers = useMemo(() => {
    return usersWithSearchString.filter(u => {
      if (activeTab !== "all" && u.user_type !== activeTab) return false
      
      if (deferredSearchQuery) {
        return u._searchString.includes(deferredSearchQuery.toLowerCase())
      }
      return true
    })
  }, [usersWithSearchString, deferredSearchQuery, activeTab])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE))
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return filteredUsers.slice(start, end)
  }, [filteredUsers, currentPage])

  const handleUpdate = (updatedUser: any) => {
    setUsers(prev => {
      const index = prev.findIndex(u => u.id === updatedUser.id)
      if (index > -1) {
        const newArr = [...prev]
        newArr[index] = updatedUser
        return newArr
      }
      return [updatedUser, ...prev]
    })
    // Sync for server-side updates if needed
    router.refresh()
  }

  const openNew = () => {
    router.push("/users/new")
  }

  const openEdit = (user: UserWithAccounts) => {
    router.push(`/users/${user.id}`)
  }

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto py-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase flex items-center gap-3">
             {t("contacts.title")}
          </h1>
          <p className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em] mt-2">{t("contacts.subtitle")}</p>
        </div>
        <Button onClick={openNew} className="rounded-2xl h-14 bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-widest text-[10px] px-8 shadow-3xl transition-all active:scale-[0.98]">
          <Plus className="mr-2 size-4" /> {t("contacts.add")}
        </Button>
      </div>
      
      <div className="mx-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <Tabs defaultValue="all" value={activeTab} onValueChange={(val) => { setActiveTab(val); setCurrentPage(1); }} className="w-full md:w-auto">
          <TabsList className="grid w-full md:w-auto grid-cols-4 bg-muted/50 p-1 rounded-2xl h-12">
            <TabsTrigger value="all" className="rounded-xl font-bold uppercase tracking-widest text-[10px]">Todos</TabsTrigger>
            <TabsTrigger value="client" className="rounded-xl font-bold uppercase tracking-widest text-[10px] data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">Clientes</TabsTrigger>
            <TabsTrigger value="provider" className="rounded-xl font-bold uppercase tracking-widest text-[10px] data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400">Proveedores</TabsTrigger>
            <TabsTrigger value="employee" className="rounded-xl font-bold uppercase tracking-widest text-[10px] data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400">Empleados</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nombre, documento, tel..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full md:w-80 h-12 pl-10 rounded-2xl bg-card border-border shadow-sm placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-foreground transition-all"
          />
        </div>
      </div>

      <div className="mx-4">
        {/* Mobile View: Cards */}
        <div className="grid grid-cols-1 gap-4 sm:hidden">
          {paginatedUsers?.map((u) => {
            let colorBadge = "bg-card text-foreground"
            if (u.user_type === "client") colorBadge = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
            if (u.user_type === "provider") colorBadge = "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
            if (u.user_type === "employee") colorBadge = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
            
            return (
              <Card key={u.id} className="border border-border bg-card/50 p-6 rounded-[2rem] space-y-4 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => openEdit(u)}>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-black text-lg uppercase tracking-tight">{u.name}</span>
                    <div className="flex items-center gap-2 mt-2">
                       <Badge variant="outline" className={`text-[9px] uppercase font-black tracking-widest ${colorBadge}`}>
                        {t(`contacts.type_${u.user_type.toLowerCase()}`)}
                      </Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-col pt-2 border-border gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <span>{u.document_type}: {u.document_number}</span>
                {u.phone && <span>{t("contacts.phone_label")}: {u.phone}</span>}
                <span className="mt-2 text-foreground flex gap-1 items-center">
                   <Landmark className="size-3" /> {u.bank_accounts?.length || 0} {t("contacts.bank_accounts")}
                </span>
              </div>
              </Card>
            )
          })}
          {filteredUsers.length === 0 && (
            <div className="py-20 text-center border border-dashed border-border rounded-[2.5rem] bg-card/20">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground px-4">
                {t("contacts.no_results")}
              </p>
            </div>
          )}
        </div>

        {/* Desktop View: Table */}
        <Card className="hidden sm:block border border-border bg-card/50 shadow-2xl overflow-hidden rounded-[2.5rem]">
          <CardHeader className="bg-card border-b border-border py-6 px-8">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3">
              <Contact className="size-3" /> {t("contacts.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="font-black uppercase tracking-widest text-[10px] py-4 px-8 text-muted-foreground">{t("contacts.name")}</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] py-4 text-muted-foreground">{t("contacts.type")}</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] py-4 text-muted-foreground">{t("contacts.document")}</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] py-4 text-muted-foreground">{t("contacts.banks")}</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] py-4 px-8 text-right text-muted-foreground">{t("contacts.file_upload")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers?.map((u) => {
                  let colorBadge = "bg-card text-foreground"
                  if (u.user_type === "client") colorBadge = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                  if (u.user_type === "provider") colorBadge = "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                  if (u.user_type === "employee") colorBadge = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"

                  return (
                    <TableRow key={u.id} className="border-border transition-all group hover:bg-muted/50 cursor-pointer" onClick={() => openEdit(u)}>
                      <TableCell className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-black text-sm uppercase tracking-tight text-foreground">{u.name}</span>
                        {u.phone && <span className="text-[9px] font-bold tracking-widest text-muted-foreground mt-1 uppercase">{t("contacts.phone_label")}: {u.phone}</span>}
                        {u.email && <span className="text-[9px] font-bold tracking-widest text-muted-foreground mt-0.5 lowercase">{u.email}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[9px] uppercase font-black tracking-widest ${colorBadge}`}>
                        {t(`contacts.type_${u.user_type.toLowerCase()}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {u.document_type}: <span className="text-foreground">{u.document_number}</span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {u.bank_accounts?.length > 0 ? (
                          <span className="text-[9px] font-bold uppercase tracking-widest text-foreground flex items-center gap-1">
                             <Landmark className="size-3 text-muted-foreground" /> {u.bank_accounts.length} Cuentas Guardadas
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">
                             Sin Cuentas
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-8 text-right">
                       <div className="flex justify-end gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                          {u.tax_document_url ? <DownloadCloud className="size-4 text-green-500/70" /> : <FileText className="size-4 opacity-30" />}
                          {u.id_document_url ? <DownloadCloud className="size-4 text-blue-500/70" /> : <FileText className="size-4 opacity-30" />}
                       </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-20 text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">No hay contactos para esta búsqueda</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="mx-4 mt-6">
        <div className="flex items-center justify-between border border-border bg-card/50 rounded-[2rem] px-6 py-4 shadow-sm">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden sm:block">
            {filteredUsers.length === 0 ? "Sin resultados" : `Mostrando ${((currentPage - 1) * ITEMS_PER_PAGE) + 1} a ${Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} de ${filteredUsers.length}`}
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-xl border-border bg-background hover:bg-muted text-[10px] uppercase font-black tracking-widest px-4 h-10 transition-colors"
            >
              <ChevronLeft className="size-4 mr-1" /> Anterior
            </Button>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest sm:hidden flex items-center">
              Pág {currentPage} / {totalPages}
            </span>
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="rounded-xl border-border bg-background hover:bg-muted text-[10px] uppercase font-black tracking-widest px-4 h-10 transition-colors"
            >
              Siguiente <ChevronRight className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Landmark(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>
}
