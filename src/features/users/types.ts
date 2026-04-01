export type UserType = 'client' | 'provider' | 'employee'
export type DocumentType = 'CC' | 'NIT' | 'CE' | 'PASSPORT'

export interface User {
  id: string
  user_type: UserType
  name: string
  document_type: DocumentType
  document_number: string
  phone: string | null
  email: string | null
  tax_document_url: string | null
  id_document_url: string | null
  profile_id: string | null
  created_at: string
  updated_at: string
}

export type AccountType = 'SAVINGS' | 'CHECKING' | 'DIGITAL_WALLET'

export interface BankAccount {
  id: string
  user_id: string
  bank_id: string
  account_type: AccountType
  account_number: string | null
  is_primary: boolean
  created_at: string
  updated_at: string
}
