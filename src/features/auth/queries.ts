import { createClient } from "@/shared/supabase/server"

export async function getProfile() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    console.log("DEBUG: No authenticated user in session")
    return null
  }

  console.log("DEBUG: Authenticated User:", user.email, "Auth ID:", user.id)

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) console.error("DEBUG: Error fetching profile:", error.message)
  if (profile) console.log("DEBUG: Profile found:", profile.email, "Role:", profile.role, "ID:", profile.id)
  else console.log("DEBUG: No profile found for Auth User ID:", user.id)

  return profile
}

export async function isAdmin() {
  const profile = await getProfile()
  return profile?.role === 'admin' || profile?.role === 'superadmin'
}
