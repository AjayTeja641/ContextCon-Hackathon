import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "outline" | "indigo" | "purple";
}

export function Badge({ children, variant = "default", className, ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-800 text-slate-300 border-slate-700",
    success: "bg-emerald-950/80 text-emerald-400 border-emerald-800/60",
    warning: "bg-amber-950/80 text-amber-400 border-amber-800/60",
    destructive: "bg-rose-950/80 text-rose-400 border-rose-800/60",
    outline: "bg-transparent text-slate-400 border-slate-700",
    indigo: "bg-indigo-950/80 text-indigo-400 border-indigo-800/60",
    purple: "bg-purple-950/80 text-purple-400 border-purple-800/60",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
}
