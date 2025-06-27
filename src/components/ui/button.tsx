import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-[#181818] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#E50914] to-[#b0060f] text-white hover:from-[#b0060f] hover:to-[#E50914]",
        destructive: "bg-[#b0060f] text-white hover:bg-[#E50914]",
        outline: "border border-[#E50914] text-white bg-black hover:bg-[#E50914]/20 hover:text-white",
        secondary: "bg-[#181818] text-white hover:bg-[#2a0008]",
        ghost: "bg-black text-white hover:bg-[#E50914]/10",
        link: "text-white underline underline-offset-4 hover:text-[#E50914]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 