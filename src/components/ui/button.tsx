import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@site/src/utils/cn"; // or use 'clsx' if you prefer

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}



const sizeClasses: Record<string, string> = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-6 py-2 text-sm",
  lg: "px-8 py-3 text-base",
};

const variantClasses: Record<string, string> = {
  default:
    "rounded-full px-6 py-2 font-semibold border border-gray-200 shadow-sm transition-colors " +
    "bg-white text-[#6633FF] hover:bg-[#6633FF] hover:text-white " +
    "dark:bg-[#1E1E1E] dark:text-[#AF8AFF] dark:border-gray-700 dark:hover:bg-[#AF8AFF] dark:hover:text-white",
    outline:
    "border border-[#6633FF] text-[#6633FF] dark:border-[#AF8AFF] dark:text-[#AF8AFF] hover:bg-[#f3f0ff] dark:hover:bg-[#2d1c4a]",
  
    ghost:
    "text-[#6633FF] dark:text-[#AF8AFF] hover:bg-gray-100 dark:hover:bg-gray-800",
};



export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center font-semibold transition rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
