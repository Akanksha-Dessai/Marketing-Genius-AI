import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function Card({ glow, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 ${
        glow ? "shadow-lg shadow-violet-500/10 ring-1 ring-violet-500/20" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
