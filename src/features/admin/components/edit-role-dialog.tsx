"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { updateProfile } from "@/features/admin/actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/input"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { useI18n } from "@/shared/lib/i18n-context"

export function EditRoleDialog({ userId, email, currentRole, userName, onUpdate }: { userId: string, email: string, currentRole: string, userName: string, onUpdate?: () => void }) {
  const { t } = useI18n()
  const [open, setOpen] = React.useState(false)
  const [role, setRole] = React.useState(currentRole)
  const [isPending, setIsPending] = React.useState(false)
  const router = useRouter()

  const ROLES = [
    { value: "superadmin", label: "Super Administrator" },
    { value: "admin", label: "Administrator" },
    { value: "accountant", label: "Accountant" },
    { value: "foreman", label: "Foreman" },
    { value: "assistant", label: "Assistant" },
  ]

  async function handleUpdate() {
    setIsPending(true)
    try {
      const result = await updateProfile(userId, { role })
      toast.success(t("admin.role_updated") || "Profile updated")
      setOpen(false)
      if (onUpdate) onUpdate()
      router.refresh()
    } catch (error: any) {
      console.error("UI Dialog Error:", error)
      toast.error(error.message || "Failed to update profile")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors" />
        }
      >
        {t("common.edit")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] rounded-[2.5rem] bg-background border border-border shadow-2xl p-8 data-open:zoom-in-100 duration-75">
        <DialogHeader className="gap-2 mb-4">
          <DialogTitle className="text-3xl font-black uppercase tracking-tighter">{t("admin.edit_role")}</DialogTitle>
          <DialogDescription className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest leading-relaxed">
            {t("admin.manage_user")}: <span className="text-foreground">{userName}</span>
            <br />
            <span className="text-muted-foreground/60">Email: {email}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-8 py-4">
          <div className="grid gap-4 w-full">
            <Label htmlFor="role" className="font-black text-[10px] uppercase tracking-[0.4em] text-muted-foreground ml-1">{t("admin.level")}</Label>
            <Select value={role} onValueChange={(v) => setRole(v || "")}>
              <SelectTrigger className="rounded-[1.25rem] h-16 bg-muted border-border focus:ring-ring transition-all font-black uppercase text-[10px] tracking-widest px-8 w-full group py-4">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl bg-popover border border-border p-2 min-w-[var(--radix-select-trigger-width)] shadow-3xl">
                {ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value} className="rounded-xl focus:bg-accent focus:text-accent-foreground font-black uppercase text-[10px] tracking-widest py-4 transition-colors px-6">
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-3 sm:gap-4 mt-8">
          <Button 
            variant="ghost" 
            onClick={() => setOpen(false)} 
            className="rounded-[1.25rem] h-16 w-full sm:w-auto font-black uppercase tracking-widest text-[10px] hover:bg-muted px-8"
          >
            {t("common.cancel")}
          </Button>
          <Button 
            onClick={handleUpdate} 
            disabled={isPending || role === currentRole}
            className="rounded-[1.25rem] h-16 w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-widest text-[10px] px-10 shadow-3xl transition-all active:scale-[0.98]"
          >
            {isPending ? <Loader2 className="animate-spin" /> : t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
