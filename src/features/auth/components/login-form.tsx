"use client"

import { useActionState } from "react"
import { Building2, Loader2 } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { login } from "@/features/auth/actions"

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null)

  return (
    <div className="w-full bg-background/60 backdrop-blur-3xl border border-border/40 shadow-2xl rounded-3xl p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Encabezado: Logo + "Hub" gigantes y centrados */}
      <div className="flex flex-col items-center text-center space-y-4 mb-8">
        <div className="flex items-center justify-center gap-3">
          <div className="bg-gradient-to-br from-red-600 to-red-800 p-3 rounded-2xl shadow-lg ring-1 ring-red-600/20">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-zinc-500 dark:from-red-500 dark:to-zinc-400">
            Hub
          </h1>
        </div>
        <p className="text-muted-foreground text-sm font-medium">
          Sistema de Administración Contable
        </p>
      </div>

      {/* Formulario minimalista y moderno */}
      <form action={formAction} className="space-y-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-foreground/80">Correo Electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@tucasaconstrucciones.com"
              required
              disabled={isPending}
              className="h-12 px-4 shadow-sm bg-background/50 border-border/50 transition-all hover:bg-background focus:bg-background rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-foreground/80">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              disabled={isPending}
              className="h-12 px-4 shadow-sm bg-background/50 border-border/50 transition-all hover:bg-background focus:bg-background rounded-xl"
            />
          </div>
        </div>
        
        {state?.error && (
          <div className="text-sm text-destructive font-semibold bg-destructive/10 border border-destructive/20 p-3 rounded-xl text-center">
            {state.error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-12 text-base font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-600/90 hover:to-red-700/90 text-white border-0" 
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Conectando...
            </>
          ) : (
            "Acceder"
          )}
        </Button>
      </form>
    </div>
  )
}
