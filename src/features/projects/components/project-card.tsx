"use client"

import { Card } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import { cn } from "@/shared/lib/utils"

interface ProjectCardProps {
  title: string
  location: string
  status: 'active' | 'completed' | 'on_hold'
  date: string
  progress: number
}

export function ProjectCard({ title, location, status, date, progress }: ProjectCardProps) {
  const statusColors = {
    active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    on_hold: "bg-amber-500/10 text-amber-500 border-amber-500/20"
  }

  return (
    <Card className="group border border-border bg-card p-5 rounded-3xl hover:border-muted-foreground/30 hover:scale-[0.98] active:scale-95 transition-all duration-300 cursor-pointer relative overflow-hidden">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h4 className="font-black text-sm uppercase tracking-tight group-hover:text-brand-red transition-colors">{title}</h4>
            <div className="flex items-center gap-2 text-muted-foreground font-bold text-[9px] uppercase tracking-widest">
              <MapPin className="size-2.5" />
              {location}
            </div>
          </div>
          <Badge className={cn("rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border", statusColors[status])}>
            {status.replace('_', ' ')}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-1.5 text-muted-foreground/80 font-bold text-[8px] uppercase tracking-tighter">
              <Calendar className="size-2.5" />
              {date}
            </div>
            <span className="font-black text-[10px] text-foreground">{progress}%</span>
          </div>
          <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-foreground group-hover:bg-brand-red transition-all duration-500" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
      </div>
      
      <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="size-4 text-brand-red" />
      </div>
    </Card>
  )
}
