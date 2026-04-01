"use client"

import * as React from "react"
import { createBank } from "@/features/banks/actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/input"
import { toast } from "sonner"
import { Loader2, Plus, Landmark } from "lucide-react"
import { useI18n } from "@/shared/lib/i18n-context"
import { useRouter } from "next/navigation"

export function AddBankDialog({ onUpdate }: { onUpdate?: (bank: any) => void }) {
  const { t } = useI18n()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [name, setName] = React.useState("")

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error(t("admin.fill_all_fields") || "Please fill all fields")
      return
    }

    setSubmitting(true)
    try {
      const newBank = await createBank(name.trim())
      toast.success(t("banks.bank_added") || "Bank added successfully")
      setOpen(false)
      setName("")
      router.refresh()
      if (onUpdate) onUpdate(newBank)
    } catch (error: any) {
      if (error.message.includes("exists")) {
        toast.error(t("banks.bank_exists") || "That bank already exists")
      } else {
        toast.error(error.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="rounded-2xl h-14 bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-widest text-[10px] px-8 shadow-3xl transition-all active:scale-[0.98]">
             <Plus className="mr-2 size-4" /> {t("banks.add_bank")}
          </Button>
        }
      >
        {t("banks.add_bank")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] bg-background border border-border shadow-2xl p-8 data-open:zoom-in-100 duration-75">
        <DialogHeader className="gap-2 mb-4 text-left">
          <DialogTitle className="text-3xl font-black uppercase tracking-tighter flex items-center gap-2">
            <Landmark className="size-6 text-muted-foreground" />
            {t("banks.add_bank")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest leading-relaxed">
            {t("banks.subtitle")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4 font-bold">
          <div className="grid gap-3">
            <Label className="font-black text-[10px] uppercase tracking-[0.4em] text-muted-foreground ml-1">
              {t("banks.bank_name")}
            </Label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              placeholder="Ej. BANCOLOMBIA"
              className="rounded-2xl h-16 bg-muted border-border uppercase focus-visible:ring-ring transition-all font-black text-sm px-8"
              autoFocus
            />
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-4 mt-8">
          <Button 
            variant="ghost" 
            onClick={() => setOpen(false)} 
            disabled={submitting}
            className="rounded-[1.25rem] h-16 w-full sm:w-auto font-black uppercase tracking-widest text-[10px] px-8 hover:bg-muted"
          >
            {t("common.cancel")}
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={submitting || !name.trim()}
            className="rounded-[1.25rem] h-16 w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-widest text-[10px] px-10 shadow-3xl transition-all active:scale-[0.98]"
          >
            {submitting ? <Loader2 className="animate-spin" /> : t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
