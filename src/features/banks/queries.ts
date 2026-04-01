"use server"

import { createClient } from "@/shared/supabase/server"
import { Bank } from "./types"

export async function getBanks(onlyActive: boolean = false): Promise<Bank[]> {
  const supabase = await createClient()
  let query = supabase.from('banks').select('id, name, is_active, created_at, updated_at').order('name')
  
  if (onlyActive) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching banks:", error.message)
    return []
  }

  return (data || []) as unknown as Bank[]
}
