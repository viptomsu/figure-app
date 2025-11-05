import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

export interface StepItem {
  title: string
}

export interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  current: number
  items: StepItem[]
}

function Steps({ className, current, items, ...props }: StepsProps) {
  // Clamp current to valid range
  const clampedCurrent = Math.max(0, Math.min(current, items.length - 1))

  return (
    <div
      role="list"
      className={cn("flex w-full flex-col gap-4 md:flex-row md:items-center", className)}
      {...props}
    >
      {items.map((item, index) => {
        const isCompleted = index < clampedCurrent
        const isActive = index === clampedCurrent

        return (
          <React.Fragment key={index}>
            <div className="flex flex-1 flex-col items-center gap-2">
              <div
                role="listitem"
                aria-current={isActive ? "step" : undefined}
                aria-label={`Step ${index + 1}${isActive ? " (current)" : isCompleted ? " (completed)" : ""}: ${item.title}`}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  isActive && "border-primary text-primary",
                  !isCompleted && !isActive && "border-muted-foreground/20 text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-center text-sm font-medium",
                  isActive && "text-foreground",
                  !isActive && "text-muted-foreground"
                )}
              >
                {item.title}
              </span>
            </div>
            {index < items.length - 1 && (
              <div
                className={cn(
                  "hidden flex-1 md:block",
                  isCompleted && "border-primary",
                  !isCompleted && "border-muted-foreground/20"
                )}
              >
                <div
                  className={cn(
                    "h-0.5 w-full",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export { Steps }
