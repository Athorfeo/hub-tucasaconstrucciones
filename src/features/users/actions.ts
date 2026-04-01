"use server"

import { createClient } from "@/shared/supabase/server"
import { revalidatePath } from "next/cache"
import { User, BankAccount } from "./types"

type UserInput = Omit<User, 'id' | 'created_at' | 'updated_at'> // we omit generated fields
type BankAccountInput = Omit<BankAccount, 'id' | 'user_id' | 'created_at' | 'updated_at'> 

export async function createUserWithAccounts(userData: UserInput, accounts: BankAccountInput[]) {
  const supabase = await createClient()

  // 1. Insert User
  const { data: user, error: userError } = await supabase
    .from('users')
    .insert([userData])
    .select('id, name, user_type, document_type, document_number, phone, email, tax_document_url, id_document_url, created_at')
    .single()

  if (userError) {
    throw new Error(`Failed to create user: ${userError.message}`)
  }

  // 2. Insert Accounts if any
  if (accounts && accounts.length > 0) {
    const accountsPayload = accounts.map(acc => ({
      ...acc,
      user_id: user.id
    }))

    const { error: accountsError } = await supabase
      .from('bank_accounts')
      .insert(accountsPayload)

    if (accountsError) {
      console.error("Warning: Profile created but bank accounts failed", accountsError.message)
      // Throwing here would be okay, or handle gracefully depending on requirements.
      throw new Error(`User created but failed to save bank accounts: ${accountsError.message}`)
    }
  }

  revalidatePath('/users')
  return user
}

export async function updateUserWithAccounts(userId: string, userData: Partial<UserInput>, accounts: BankAccountInput[]) {
  const supabase = await createClient()

  // 1. Update User
  const { data: user, error: userError } = await supabase
    .from('users')
    .update(userData)
    .eq('id', userId)
    .select('id, name, user_type, document_type, document_number, phone, email, tax_document_url, id_document_url, created_at')
    .single()

  if (userError) {
    throw new Error(`Failed to update user: ${userError.message}`)
  }

  // 2. Handle Accounts
  // A simple strategy is to delete all existing accounts and insert the new array.
  // This avoids complex differential updates, since they don't have FK dependents yet.
  const { error: deleteError } = await supabase
    .from('bank_accounts')
    .delete()
    .eq('user_id', userId)

  if (deleteError) {
    throw new Error(`Failed to clear old bank accounts: ${deleteError.message}`)
  }

  if (accounts && accounts.length > 0) {
    const accountsPayload = accounts.map(acc => ({
      ...acc,
      user_id: userId
    }))

    const { error: insertError } = await supabase
      .from('bank_accounts')
      .insert(accountsPayload)

    if (insertError) {
      throw new Error(`Failed to save new bank accounts: ${insertError.message}`)
    }
  }

  // 3. Final Fetch to return full object for instant UI update
  const { data: fullUser } = await supabase
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
    .eq('id', userId)
    .single()

  revalidatePath('/users')
  return fullUser
}

export async function uploadDocument(userId: string, file: File, documentField: 'tax_document_url' | 'id_document_url') {
  const supabase = await createClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}-${documentField}-${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  // Ensure "users_docs" bucket exists
  const { error: uploadError } = await supabase.storage
    .from('users_docs')
    .upload(filePath, file)

  if (uploadError) {
    throw new Error(`Failed to upload document: ${uploadError.message}`)
  }

  const { data: { publicUrl } } = supabase.storage
    .from('users_docs')
    .getPublicUrl(filePath)

  // Update User record with the new URL
  const { error: updateError } = await supabase
    .from('users')
    .update({ [documentField]: publicUrl })
    .eq('id', userId)

  if (updateError) {
    throw new Error(`Failed to update user record: ${updateError.message}`)
  }

  revalidatePath('/users')
  return publicUrl
}
