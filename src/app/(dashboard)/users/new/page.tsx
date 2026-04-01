import React from "react"
import { getBanks } from "@/features/banks/queries"
import { UserFormPageLayout } from "@/features/users/components/user-form-page-layout"

export default async function NewUserPage() {
  const banks = await getBanks(true)

  return <UserFormPageLayout banks={banks || []} />
}
