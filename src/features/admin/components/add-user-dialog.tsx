"use client"

import * as React from "react"
import { createClient } from "@/shared/supabase/client"
import { getUnprofiledUsers } from "@/features/admin/actions"
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
import { Loader2, UserPlus } from "lucide-react"
import { useI18n } from "@/shared/lib/i18n-context"
import { useRouter } from "next/navigation"

const ROLES = [
  { value: "superadmin", label: "Super Administrator" },
  { value: "admin", label: "Administrator" },
  { value: "accountant", label: "Accountant" },
  { value: "foreman", label: "Foreman" },
  { value: "assistant", label: "Assistant" },
]

export function AddUserDialog({ onUserAdded }: { onUserAdded?: () => void }) {
  const { t } = useI18n()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [loadingUsers, setLoadingUsers] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [unprofiledUsers, setUnprofiledUsers] = React.useState<any[]>([])
  
  const [selectedUserId, setSelectedUserId] = React.useState("")
  const [fullName, setFullName] = React.useState("")
  const [role, setRole] = React.useState("assistant")

  const loadUnprofiled = async () => {
    setLoadingUsers(true)
    try {
      const data = await getUnprofiledUsers()
      setUnprofiledUsers(data)
    } catch (error: any) {
      console.error("loadUnprofiled error:", error)
      toast.error(`${t("admin.load_unprofiled_error")}: ${error.message}`)
    } finally {
      setLoadingUsers(false)
    }
  }

  React.useEffect(() => {
    if (open) {
      loadUnprofiled()
    }
  }, [open])

  const handleCreate = async () => {
    if (!selectedUserId || !fullName) {
      toast.error(t("admin.fill_all_fields") || "Please fill all fields")
      return
    }

    setSubmitting(true)
    const supabase = createClient()
    
    const selectedUser = unprofiledUsers.find(u => u.id === selectedUserId)

    const { error } = await supabase.from('profiles').insert({
      id: selectedUserId,
      full_name: fullName,
      role: role,
      email: selectedUser?.email
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success(t("admin.user_created") || "User enrolled successfully")
      setOpen(false)
      setSelectedUserId("")
      setFullName("")
      if (onUserAdded) onUserAdded()
      router.refresh()
    }
    setSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="rounded-2xl h-14 bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-widest text-[10px] px-8 shadow-3xl transition-all active:scale-[0.98]">
             <UserPlus className="mr-2 size-4" /> {t("admin.add_user")}
          </Button>
        }
      >
        {t("admin.add_user")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] bg-background border border-border shadow-2xl p-8 data-open:zoom-in-100 duration-75">
        <DialogHeader className="gap-2 mb-4 text-left">
          <DialogTitle className="text-3xl font-black uppercase tracking-tighter">{t("admin.enroll_user")}</DialogTitle>
          <DialogDescription className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest leading-relaxed">
            {t("admin.enroll_desc")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4 font-bold">
          <div className="grid gap-3 w-full">
            <Label className="font-black text-[10px] uppercase tracking-[0.4em] text-muted-foreground ml-1">{t("admin.select_auth_user")}</Label>
            <Select value={selectedUserId} onValueChange={(v) => setSelectedUserId(v || "")}>
              <SelectTrigger className="rounded-[1.25rem] h-16 bg-muted border-border focus:ring-ring text-sm font-bold px-8 w-full py-4">
                <SelectValue placeholder={loadingUsers ? "..." : t("admin.select_user_placeholder")} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl bg-popover border border-border p-2 min-w-[var(--radix-select-trigger-width)] shadow-3xl">
                {unprofiledUsers.length === 0 ? (
                  <div className="p-4 text-center text-[10px] text-muted-foreground uppercase font-black">{t("admin.no_pending_users")}</div>
                ) : (
                  unprofiledUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id} className="rounded-xl focus:bg-accent focus:text-accent-foreground font-bold text-xs py-3 px-6">
                      {u.email}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <Label className="font-black text-[10px] uppercase tracking-[0.4em] text-muted-foreground ml-1">{t("admin.full_name")}</Label>
            <Input 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="rounded-2xl h-16 bg-muted border-border focus-visible:ring-ring transition-all font-bold text-sm px-8"
            />
          </div>

          <div className="grid gap-3 w-full">
            <Label className="font-black text-[10px] uppercase tracking-[0.4em] text-muted-foreground ml-1">{t("admin.role")}</Label>
            <Select value={role} onValueChange={(v) => setRole(v || "assistant")}>
              <SelectTrigger className="rounded-[1.25rem] h-16 bg-muted border-border focus:ring-ring font-black uppercase text-[10px] tracking-widest px-8 w-full py-4">
                <SelectValue />
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
            className="rounded-[1.25rem] h-16 w-full sm:w-auto font-black uppercase tracking-widest text-[10px] px-8 hover:bg-muted"
          >
            {t("common.cancel")}
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={submitting || !selectedUserId || !fullName}
            className="rounded-[1.25rem] h-16 w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-widest text-[10px] px-10 shadow-3xl transition-all active:scale-[0.98]"
          >
            {submitting ? <Loader2 className="animate-spin" /> : t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
