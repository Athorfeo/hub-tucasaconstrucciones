"use client"

import * as React from "react"
import { toggleBankState } from "@/features/banks/actions"
import { toast } from "sonner"
import { useI18n } from "@/shared/lib/i18n-context"
import { Loader2 } from "lucide-react"

export function BankToggle({ bankId, isActive, onUpdate }: { bankId: string, isActive: boolean, onUpdate?: (bank: any) => void }) {
  const { t } = useI18n()
  const [loading, setLoading] = React.useState(false)
  const [optimisticActive, setOptimisticActive] = React.useState(isActive)

  // Sync optimistic state if external isActive changes
  React.useEffect(() => {
    setOptimisticActive(isActive)
  }, [isActive])

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextState = !optimisticActive
    
    // Set optimistic state immediately
    setOptimisticActive(nextState)
    setLoading(true)

    try {
      const updatedBank = await toggleBankState(bankId, nextState)
      toast.success(t("banks.bank_updated") || "Bank updated successfully")
      if (onUpdate) onUpdate(updatedBank)
    } catch (error: any) {
      // Rollback on error
      setOptimisticActive(isActive)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-start rounded-full border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 p-0 ${
        optimisticActive 
          ? "bg-emerald-500/20 border-emerald-500/30 shadow-[inset_0_1px_4px_rgba(16,185,129,0.05)]" 
          : "bg-red-500/10 border-red-500/20 shadow-[inset_0_1px_4px_rgba(239,68,68,0.05)]"
      }`}
    >
      {loading ? (
        <Loader2 className="absolute size-3 animate-spin text-white left-1/2 -translate-x-1/2 z-10" />
      ) : null}
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.3)] ring-0 transition-transform ${
          optimisticActive ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  )
}
