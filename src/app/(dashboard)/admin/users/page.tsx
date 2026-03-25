"use client"

import React, { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/shared/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { UserCog, ShieldCheck, Mail, Calendar, Tag } from "lucide-react"
import { EditRoleDialog } from "@/features/admin/components/edit-role-dialog"
import { AddUserDialog } from "@/features/admin/components/add-user-dialog"
import { useI18n } from "@/shared/lib/i18n-context"
import { RoleBadge } from "../../../../features/admin/components/role-badge"
import { Badge } from "@/shared/components/ui/badge"

export default function AdminUsersPage() {
  const { t } = useI18n()
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = React.useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('updated_at', { ascending: false })
    
    if (data) setProfiles(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) return <div className="p-10 font-black uppercase tracking-widest text-zinc-500 animate-pulse">{t("common.loading")}</div>

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto py-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase flex items-center gap-3">
             {t("admin.title")}
          </h1>
          <p className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em] mt-2">{t("admin.subtitle")}</p>
        </div>
        <AddUserDialog onUserAdded={loadData} />
      </div>

      <div className="mx-4">
        {/* Mobile View: Cards */}
        <div className="grid grid-cols-1 gap-4 sm:hidden">
          {profiles?.map((p) => (
            <Card key={p.id} className="border border-border bg-card/50 p-6 rounded-[2rem] space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-black text-lg uppercase tracking-tight">{p.full_name || "No name"}</span>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{p.email}</span>
                </div>
                <RoleBadge role={p.role} />
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-[9px] font-bold uppercase text-muted-foreground/60">{t("admin.updated")}: {new Date(p.updated_at).toLocaleDateString()}</span>
                <EditRoleDialog 
                  userId={p.id} 
                  email={p.email}
                  currentRole={p.role} 
                  userName={p.full_name || p.email} 
                  onUpdate={loadData}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop View: Table */}
        <Card className="hidden sm:block border border-border bg-card/50 shadow-2xl overflow-hidden rounded-[2.5rem]">
          <CardHeader className="bg-card border-b border-border py-6 px-8">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3">
              <Tag className="size-3" /> {t("admin.directory")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="font-black uppercase tracking-widest text-[10px] py-4 px-8 text-muted-foreground">{t("admin.user")}</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] py-4 text-muted-foreground">{t("admin.role")}</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] py-4 text-muted-foreground">Email</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] py-4 px-8 text-muted-foreground text-right">{t("admin.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles?.map((p) => (
                  <TableRow key={p.id} className="border-border hover:bg-muted/50 transition-all group">
                    <TableCell className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-black text-sm uppercase tracking-tight text-foreground">{p.full_name || "No name"}</span>
                        <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="size-2.5" /> {t("admin.updated")}: {new Date(p.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={p.role} />
                    </TableCell>
                    <TableCell className="text-sm font-medium text-muted-foreground">
                      {p.email}
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <EditRoleDialog 
                        userId={p.id} 
                        email={p.email}
                        currentRole={p.role} 
                        userName={p.full_name || p.email} 
                        onUpdate={loadData}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <div className="mx-4 p-5 bg-card border border-border rounded-2xl flex items-center gap-4">
        <ShieldCheck className="text-foreground size-5" />
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed">
          <strong>Security:</strong> {t("admin.security_note")}
        </p>
      </div>
    </div>
  )
}

