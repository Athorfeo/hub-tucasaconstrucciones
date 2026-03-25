import * as React from "react"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/shared/lib/utils"

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  items: {
    label: string
    href?: string
    active?: boolean
  }[]
}

export function Breadcrumb({ items, className, ...props }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground", className)}
      {...props}
    >
      <ol className="flex items-center gap-2">
        <li className="flex items-center gap-2">
          <a href="/" className="hover:text-foreground transition-colors">
            <Home className="size-3" />
          </a>
        </li>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <ChevronRight className="size-3 text-muted-foreground/50" />
            <li>
              {item.href && !item.active ? (
                <a
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className={cn(item.active ? "text-foreground font-black" : "")}>
                  {item.label}
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}
