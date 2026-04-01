import React, { Suspense } from "react"
import { getUsers } from "@/features/users/queries"
import { getBanks } from "@/features/banks/queries"
import { UsersClientPage } from "@/features/users/components/users-client-page"

export default async function ContactsPage() {
  const [initialUsers, activeBanks] = await Promise.all([
    getUsers(),
    getBanks(true)
  ])

  return (
    <Suspense fallback={<div className="p-10 font-black uppercase tracking-widest text-zinc-500 animate-pulse">Cargando Usuarios...</div>}>
      <UsersClientPage initialUsers={initialUsers} activeBanks={activeBanks || []} />
    </Suspense>
  )
}
