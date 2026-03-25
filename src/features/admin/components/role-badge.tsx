import { Badge } from "@/shared/components/ui/badge"

export function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    superadmin: "bg-white text-black",
    admin: "bg-zinc-200 text-black",
    accountant: "bg-zinc-800 text-white",
    foreman: "bg-zinc-700 text-white",
    assistant: "bg-zinc-900 text-white",
  }

  return (
    <Badge className={`${colors[role] || "bg-zinc-500"} border-none font-black px-3 py-0.5 text-[10px] uppercase tracking-tighter rounded-full`}>
      {role}
    </Badge>
  )
}
