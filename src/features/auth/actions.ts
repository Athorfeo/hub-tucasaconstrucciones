"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/shared/supabase/server"

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // Extract from FormData
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Por favor ingresa tu correo y contraseña." }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: "Credenciales incorrectas o el usuario no existe." }
  }

  // Si fue exitoso, revalidamos la página raíz y dirigimos al usuario
  revalidatePath("/", "layout")
  redirect("/")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
