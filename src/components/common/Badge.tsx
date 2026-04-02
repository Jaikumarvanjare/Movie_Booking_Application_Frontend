interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "error" | "warning" | "info" | "default";
  size?: "sm" | "md";
}

const Badge = ({ children, variant = "default", size = "sm" }: BadgeProps) => {
  const variants = {
    success: "bg-green-500/15 text-green-400 border-green-500/20",
    error: "bg-red-500/15 text-red-400 border-red-500/20",
    warning: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    info: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    default: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
};

export default Badge;
