"use client"

import * as React from "react"
import { editBankName } from "@/features/banks/actions"
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
import { Loader2, Edit3, Landmark } from "lucide-react"
import { useI18n } from "@/shared/lib/i18n-context"
import { useRouter } from "next/navigation"

export function EditBankDialog({ bankId, initialName, onUpdate }: { bankId: string, initialName: string, onUpdate?: (bank: any) => void }) {
  const { t } = useI18n()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [name, setName] = React.useState(initialName)

  const handleEdit = async () => {
    if (!name.trim()) {
      toast.error(t("admin.fill_all_fields") || "Please fill all fields")
      return
    }

    if (name.trim() === initialName) {
      setOpen(false)
      return
    }

    setSubmitting(true)
    try {
      const updatedBank = await editBankName(bankId, name.trim())
      toast.success(t("banks.bank_updated") || "Bank updated successfully")
      setOpen(false)
      router.refresh()
      if (onUpdate) onUpdate(updatedBank)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  React.useEffect(() => {
    if (open) {
      setName(initialName)
    }
  }, [open, initialName])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" className="hover:bg-muted text-muted-foreground hover:text-foreground">
            <Edit3 className="size-4" />
          </Button>
        }
      >
        <Edit3 className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] bg-background border border-border shadow-2xl p-8 data-open:zoom-in-100 duration-75">
        <DialogHeader className="gap-2 mb-4 text-left">
          <DialogTitle className="text-3xl font-black uppercase tracking-tighter flex items-center gap-2">
            <Landmark className="size-6 text-muted-foreground" />
            {t("banks.edit_bank")}
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
            onClick={handleEdit} 
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
