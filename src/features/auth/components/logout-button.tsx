"use client"

import { LogOut } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { logout } from "@/features/auth/actions"

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button variant="outline" type="submit">
        <LogOut className="w-4 h-4 mr-2" />
        Cerrar Sesión
      </Button>
    </form>
  )
}
