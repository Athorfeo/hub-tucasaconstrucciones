import React from "react"
import { notFound } from "next/navigation"
import { getBanks } from "@/features/banks/queries"
import { getUserById } from "@/features/users/queries"
import { UserFormPageLayout } from "@/features/users/components/user-form-page-layout"

interface EditUserPageProps {
  params: Promise<{ id: string }>
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params
  
  const [user, banks] = await Promise.all([
    getUserById(id),
    getBanks(true)
  ])

  if (!user) {
    return notFound()
  }

  return <UserFormPageLayout initialData={user} banks={banks || []} />
}
