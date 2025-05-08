import * as React from "react";
import { cn } from "@site/src/utils/cn"; // Ensure cn.ts exists in utils


export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-zinc-200 bg-white shadow-sm p-4 dark:border-zinc-800 dark:bg-zinc-900",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

export const CardContent = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2 text-sm", className)} {...props} />
));
CardContent.displayName = "CardContent";