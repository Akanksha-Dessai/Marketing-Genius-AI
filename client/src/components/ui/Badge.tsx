interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "info";
}

const variants = {
  default: "bg-white/10 text-slate-300",
  success: "bg-emerald-500/20 text-emerald-300",
  warning: "bg-amber-500/20 text-amber-300",
  info: "bg-cyan-500/20 text-cyan-300",
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
