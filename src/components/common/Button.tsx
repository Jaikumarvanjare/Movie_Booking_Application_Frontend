import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
}

const Button = ({ 
  children, 
  className = "", 
  variant = "primary",
  ...props 
}: ButtonProps) => {
  const baseStyles = "rounded-lg px-4 py-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-60";
  
  const variants = {
    primary: "bg-rose-600 text-white hover:bg-rose-700",
    secondary: "bg-slate-800 text-white hover:bg-slate-700",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;