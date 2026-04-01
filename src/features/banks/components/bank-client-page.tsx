"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Landmark, ShieldCheck, Calendar } from "lucide-react"
import { useI18n } from "@/shared/lib/i18n-context"
import { Badge } from "@/shared/components/ui/badge"

import { AddBankDialog } from "@/features/banks/components/add-bank-dialog"
import { EditBankDialog } from "@/features/banks/components/edit-bank-dialog"
import { BankToggle } from "@/features/banks/components/bank-toggle"
import { Bank } from "@/features/banks/types"

export function BankClientPage({ initialBanks }: { initialBanks: Bank[] }) {
  const { t } = useI18n()
  const [banks, setBanks] = useState<Bank[]>(initialBanks)

  // Surgical Update Logic: No re-fetch, just state manipulation
  const handleUpdate = (updatedBank: Bank) => {
    setBanks((prev) => {
      let newArr = [...prev]
      const index = newArr.findIndex((b) => b.id === updatedBank.id)
      
      if (index > -1) {
        // Update existing
        newArr[index] = updatedBank
      } else {
        // Add new
        newArr.push(updatedBank)
      }
      
      // Keep alphabetical order locally
      return newArr.sort((a, b) => a.name.localeCompare(b.name))
    })
  }

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto py-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase flex items-center gap-3">
             {t("banks.title")}
          </h1>
          <p className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em] mt-2">{t("banks.subtitle")}</p>
        </div>
        <AddBankDialog onUpdate={handleUpdate} />
      </div>

      <div className="mx-4">
        {/* Mobile View: Cards */}
        <div className="grid grid-cols-1 gap-4 sm:hidden">
          {banks.map((b) => (
            <Card key={b.id} className={`border border-border bg-card/50 p-6 rounded-[2rem] space-y-4 transition-opacity ${!b.is_active ? 'opacity-50' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-black text-lg uppercase tracking-tight">{b.name}</span>
                    <Badge variant={b.is_active ? "default" : "secondary"} className="mt-2 w-20 justify-center text-[10px] uppercase font-bold tracking-widest px-0">
                      {b.is_active ? t("banks.active") : t("banks.inactive")}
                    </Badge>
                  </div>
                  <BankToggle bankId={b.id} isActive={b.is_active} onUpdate={handleUpdate} />
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-[9px] font-bold uppercase text-muted-foreground/60">{t("common.edit")}</span>
                  <EditBankDialog bankId={b.id} initialName={b.name} onUpdate={handleUpdate} />
                </div>
            </Card>
          ))}
        </div>

        {/* Desktop View: Table */}
        <Card className="hidden sm:block border border-border bg-card/50 shadow-2xl overflow-hidden rounded-[2.5rem]">
          <CardHeader className="bg-card border-b border-border py-6 px-8">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3">
              <Landmark className="size-3" /> {t("banks.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="font-black uppercase tracking-widest text-[10px] py-4 px-8 text-muted-foreground">{t("banks.bank_name")}</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] py-4 text-muted-foreground">{t("banks.status")}</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] py-4 px-8 text-muted-foreground text-right">{t("common.edit")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banks.map((b) => (
                  <TableRow key={b.id} className={`border-border transition-all group hover:bg-muted/50 ${!b.is_active ? 'opacity-60 saturate-50' : ''}`}>
                    <TableCell className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-black text-sm uppercase tracking-tight text-foreground">{b.name}</span>
                        <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="size-2.5" /> ID: {b.id.split('-')[0]}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <BankToggle bankId={b.id} isActive={b.is_active} onUpdate={handleUpdate} />
                        <Badge variant={b.is_active ? "default" : "secondary"} className="w-20 justify-center text-[9px] uppercase font-black tracking-widest px-0">
                          {b.is_active ? t("banks.active") : t("banks.inactive")}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <EditBankDialog bankId={b.id} initialName={b.name} onUpdate={handleUpdate} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <div className="mx-4 p-5 bg-card border border-border rounded-2xl flex items-center gap-4">
        <ShieldCheck className="text-foreground size-5 flex-shrink-0" />
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed">
          <strong>Security:</strong> {t("admin.security_note")} <br/>
          <em>* Note: Deshabilitar un banco lo ocultará de las nuevas listas, pero mantendrá el historial intacto.</em>
        </p>
      </div>
    </div>
  )
}
