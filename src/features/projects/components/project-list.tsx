"use client"

import * as React from "react"
import { Input } from "@/shared/components/ui/input"
import { Search, Filter, HardHat } from "lucide-react"
import { ProjectCard } from "./project-card"
import { useI18n } from "@/shared/lib/i18n-context"

const MOCK_PROJECTS = [
  { id: 1, title: "Residencial Los Álamos", location: "Cúcuta, Norte de Santander", status: 'active' as const, date: "Ene 2024", progress: 65 },
  { id: 2, title: "Centro Comercial Oasis", location: "Villa del Rosario", status: 'active' as const, date: "Feb 2024", progress: 42 },
  { id: 3, title: "Edificio Horizonte", location: "Cúcuta, Caobos", status: 'on_hold' as const, date: "Dic 2023", progress: 15 },
]

export function ProjectList() {
  const { t } = useI18n()
  const [search, setSearch] = React.useState("")

  const filtered = MOCK_PROJECTS.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500 group-focus-within:text-white transition-colors" />
          <Input 
            placeholder={t("common.search_projects") || "Search projects..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 rounded-2xl h-14 bg-zinc-950 border-white/5 focus-visible:ring-brand-red/50 transition-all font-bold text-xs uppercase tracking-widest placeholder:text-zinc-700"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-zinc-900 border border-white/5 hover:bg-zinc-800 transition-colors cursor-pointer">
            <Filter className="size-3 text-zinc-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[600px] pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {filtered.length === 0 ? (
          <div className="p-10 text-center border border-dashed border-white/10 rounded-3xl">
            <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest italic">{t("common.no_results")}</p>
          </div>
        ) : (
          filtered.map(project => (
            <ProjectCard key={project.id} {...project} />
          ))
        )}
      </div>
    </div>
  )
}
