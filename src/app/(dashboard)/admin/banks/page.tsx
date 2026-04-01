import React, { Suspense } from "react"
import { getBanks } from "@/features/banks/queries"
import { BankClientPage } from "@/features/banks/components/bank-client-page"

export default async function AdminBanksPage() {
  const initialBanks = await getBanks()

  return (
    <Suspense fallback={<div className="p-10 font-black uppercase tracking-widest text-zinc-500 animate-pulse">Cargando Sistema...</div>}>
      <BankClientPage initialBanks={initialBanks || []} />
    </Suspense>
  )
}
