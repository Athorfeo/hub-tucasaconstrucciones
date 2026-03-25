"use client"

import { useActionState } from "react"
import { Building2 } from "lucide-react"
import React from "react" // Added React import for React.useState and React.useActionState
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { login } from "@/features/auth/actions"

import { useI18n } from "@/shared/lib/i18n-context"
import { AlertCircle, Loader2 } from "lucide-react" // Fixed AlertCircle import
import { cn } from "@/shared/lib/utils" // Added cn import

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { t } = useI18n()
  const [state, action, isPending] = useActionState(login, undefined)

  return (
    <div className={cn("flex flex-col gap-8 w-full max-w-sm mx-auto", className)} {...props}>
      <form action={action} className="flex flex-col gap-10">
        <div className="flex flex-col gap-6 text-center">
          <div className="flex justify-center">
            <h1 className="text-5xl font-black tracking-tighter uppercase border-b-4 border-white pb-2">
              Hub
            </h1>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-black uppercase tracking-widest">{t("login.welcome")}</h2>
            <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em]">{t("login.subtitle")}</p>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email" className="font-black text-[10px] uppercase tracking-[0.3em] text-zinc-500">{t("login.email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              disabled={isPending}
              className="rounded-2xl h-14 bg-zinc-900 border-white/5 focus-visible:ring-white transition-all font-sans text-base font-medium px-6"
            />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="font-black text-[10px] uppercase tracking-[0.3em] text-zinc-500">{t("login.password")}</Label>
              <a
                href="#"
                className="ml-auto text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
              >
                {t("login.forgot")}
              </a>
            </div>
            <Input 
              id="password" 
              name="password"
              type="password" 
              required 
              disabled={isPending}
              className="rounded-2xl h-14 bg-zinc-900 border-white/5 focus-visible:ring-white transition-all font-sans text-base font-medium px-6"
            />
          </div>
          {state?.error && (
            <div className="p-4 rounded-2xl bg-white text-black text-[11px] font-black uppercase tracking-widest flex items-center gap-3 animate-shake">
              <AlertCircle className="size-4" /> {state.error}
            </div>
          )}
          <Button 
             type="submit" 
             disabled={isPending}
             className="w-full rounded-2xl h-14 bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-[0.2em] text-sm shadow-2xl transition-all active:scale-[0.98] mt-4"
          >
            {isPending ? <Loader2 className="animate-spin" /> : t("login.signin")}
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            {t("login.no_account")}{" "}
            <a href="#" className="text-white hover:underline transition-colors uppercase">
              {t("login.contact")}
            </a>
          </p>
        </div>
      </form>
    </div>
  )
}
