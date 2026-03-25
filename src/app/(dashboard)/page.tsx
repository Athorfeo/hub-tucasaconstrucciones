import { getProfile } from "@/features/auth/queries"
import { DashboardContent } from "@/features/dashboard/components/dashboard-content"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const profile = await getProfile()
  
  if (!profile) {
    redirect("/login")
  }

  return <DashboardContent profile={profile} />
}
