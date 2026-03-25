"use server"

import { createClient, createAdminClient } from "@/shared/supabase/server"
import { revalidatePath } from "next/cache"
import { getProfile } from "@/features/auth/queries"

export async function updateProfile(userId: string, data: { role?: string }) {
  console.log("DEBUG: updateProfile initiated for CID:", userId, "Data:", data)
  
  const adminProfile = await getProfile()
  if (!adminProfile) {
    console.error("DEBUG: Update failed - No admin profile found for current session")
    throw new Error("Authentication required")
  }

  // Allow users to update their own profile OR admins to update anyone
  const isUpdatingSelf = adminProfile.id === userId
  const isAdmin = adminProfile.role === 'admin' || adminProfile.role === 'superadmin'

  console.log("DEBUG: Permissions -> isUpdatingSelf:", isUpdatingSelf, "isAdmin:", isAdmin, "Current Role:", adminProfile.role)

  if (!isUpdatingSelf && !isAdmin) {
    console.error("DEBUG: Permission denied for updateProfile")
    throw new Error(`Permission denied. Role: ${adminProfile.role}`)
  }

  // Bypassing RLS with Admin Client for role updates
  const supabase = await createAdminClient()

  // Use select to see if any row was actually updated
  const { data: updatedData, error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId)
    .select()

  if (error) {
    console.error("DEBUG: Supabase Update Error:", error.message)
    throw new Error(error.message)
  }

  if (!updatedData || updatedData.length === 0) {
    console.warn("DEBUG: No rows were updated. UserId might not match or RLS block.")
    throw new Error("No properties were changed or database permission denied (RLS)")
  }

  console.log("DEBUG: Update Successful. New Data:", updatedData[0])

  revalidatePath('/admin/users')
  revalidatePath('/')
  
  return { success: true, profile: updatedData[0] }
}

export async function getUnprofiledUsers() {
  const adminProfile = await getProfile()
  if (!adminProfile || (adminProfile.role !== 'admin' && adminProfile.role !== 'superadmin')) {
    throw new Error("Unauthorized")
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase.rpc('get_unprofiled_users')

  if (error) {
    console.error("DEBUG: RPC get_unprofiled_users error:", error.message)
    throw new Error(error.message)
  }

  return data || []
}
