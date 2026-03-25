import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
      <div className="relative">
        <div className="size-16 rounded-3xl bg-zinc-900 border border-white/5 shadow-2xl flex items-center justify-center animate-pulse">
          <Loader2 className="size-8 text-white animate-spin-slow" />
        </div>
        <div className="absolute -top-1 -right-1 size-4 rounded-full bg-brand-red border-4 border-zinc-900 shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="font-black text-[10px] uppercase tracking-[0.4em] text-zinc-500 animate-pulse">Loading Hub</p>
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      </div>
    </div>
  )
}
