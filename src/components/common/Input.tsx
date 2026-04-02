import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = ({ label, className = "", error, icon, ...props }: InputProps) => {
  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {icon}
          </div>
        )}
        <input
          className={`w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-brand focus:bg-slate-800 focus:shadow-[0_0_0_3px_rgba(225,29,72,0.1)] ${
            icon ? "pl-10" : ""
          } ${error ? "border-red-500 focus:border-red-500" : ""} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;