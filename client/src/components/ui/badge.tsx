import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../../lib/utils"

const badgeVariants = cva(
  "w-fit h-fit",
  {
    variants: {
      variant: {
        default:
          "border-transparent  text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent  text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent  text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
