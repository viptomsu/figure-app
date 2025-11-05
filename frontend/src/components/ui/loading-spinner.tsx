import * as React from "react"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | "sm" | "md" | "lg" | "xl"
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
}

function LoadingSpinner({
  className,
  size = "md",
  style,
  ...props
}: LoadingSpinnerProps) {
  const isNumeric = typeof size === "number"
  const sizeClass = !isNumeric ? sizeClasses[size as "sm" | "md" | "lg" | "xl"] : undefined
  const sizeStyle = isNumeric ? { width: size, height: size } : undefined

  return (
    <Loader2
      className={cn("animate-spin", sizeClass, className)}
      style={{ ...sizeStyle, ...style }}
      {...props}
    />
  )
}

export { LoadingSpinner }
