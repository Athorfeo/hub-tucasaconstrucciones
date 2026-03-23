import { LoginForm } from "@/features/auth/components/login-form"
import { ThemeToggle } from "@/shared/components/theme-toggle"

export default function LoginPage() {
  return (
    <div className="relative min-h-svh w-full flex flex-col items-center justify-center bg-background overflow-hidden p-6 gap-6">
      {/* Botón de tema flotante arriba a la derecha */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Background Decorativo "Aurora/Glass" con difuminado suave */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-red-600/15 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[400px] h-[400px] rounded-full bg-zinc-400/15 blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[600px] h-[600px] rounded-full bg-rose-700/10 blur-[120px]" />
      </div>

      {/* Contenedor principal alineado y elevado */}
      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
      
      {/* Footer pequeñito como detalle central */}
      <p className="relative z-10 text-sm text-muted-foreground/60 text-center font-medium mt-4">
        Tu Casa Construcciones &copy; {new Date().getFullYear()}
      </p>
    </div>
  )
}
