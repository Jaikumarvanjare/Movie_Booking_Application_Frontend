import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.97]";

  const variants = {
    primary:
      "bg-gradient-to-r from-brand to-brand-500 text-white hover:from-brand-dark hover:to-brand shadow-lg shadow-brand/20 hover:shadow-brand/40",
    secondary:
      "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 hover:border-slate-600",
    danger:
      "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 shadow-lg shadow-red-500/20",
    outline:
      "border-2 border-brand text-brand hover:bg-brand hover:text-white",
    ghost:
      "text-slate-300 hover:text-white hover:bg-slate-800/50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;