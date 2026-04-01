"use server"

import { createClient } from "@/shared/supabase/server"
import { User, BankAccount, UserType } from "./types"

export type UserWithAccounts = User & {
  bank_accounts: BankAccount[]
}

export async function getUsers(type?: UserType): Promise<UserWithAccounts[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('users')
    .select(`
      id, 
      name, 
      user_type, 
      document_type, 
      document_number, 
      phone, 
      tax_document_url, 
      id_document_url, 
      email,
      bank_accounts(id)
    `)
    .order('created_at', { ascending: false })
    .limit(1000)

  if (type) {
    query = query.eq('user_type', type)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching users:", error.message)
    return []
  }

  return (data || []) as unknown as UserWithAccounts[]
}

export async function getUserById(id: string): Promise<UserWithAccounts | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('users')
    .select(`
      id, 
      name, 
      user_type, 
      document_type, 
      document_number, 
      phone, 
      tax_document_url, 
      id_document_url, 
      email,
      created_at,
      bank_accounts(id, bank_id, account_number, account_type, is_primary)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error("Error fetching user:", error.message)
    return null
  }

  return data as unknown as UserWithAccounts
}
