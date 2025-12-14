import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        gray :" bg-gray-50  text-gray-600  ring-gray-500/10 ",
        red :" bg-red-50  text-red-700  ring-red-600/10 ",
        yellow :" bg-yellow-50  text-yellow-800  ring-yellow-600/20 ",
        green :" bg-green-50  text-green-700  ring-green-600/20 ",
        blue :" bg-blue-50  text-blue-700  ring-blue-700/10 ",
        indigo :" bg-indigo-50  text-indigo-700  ring-indigo-700/10 ",
        purple :" bg-purple-50  text-purple-700  ring-purple-700/10 ",
        pink :" bg-pink-50  text-pink-700  ring-pink-700/10 ",
        
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
