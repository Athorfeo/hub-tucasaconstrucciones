"use server"

import { createClient } from "@/shared/supabase/server"
import { revalidatePath } from "next/cache"

export async function createBank(name: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('banks')
    .insert({ name: name.toUpperCase() })
    .select('id, name, is_active, created_at, updated_at')
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error("Bank name already exists")
    }
    throw new Error(error.message)
  }

  revalidatePath('/admin/banks')
  return data
}

export async function toggleBankState(id: string, is_active: boolean) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('banks')
    .update({ is_active })
    .eq('id', id)
    .select('id, name, is_active, created_at, updated_at')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/banks')
  return data
}

export async function editBankName(id: string, name: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('banks')
    .update({ name: name.toUpperCase() })
    .eq('id', id)
    .select('id, name, is_active, created_at, updated_at')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/banks')
  return data
}
