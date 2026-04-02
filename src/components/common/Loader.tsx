const Loader = ({ size = "md", text }: { size?: "sm" | "md" | "lg"; text?: string }) => {
  const sizes = {
    sm: "h-5 w-5 border-2",
    md: "h-10 w-10 border-[3px]",
    lg: "h-16 w-16 border-4",
  };

  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4">
      <div className="relative">
        <div
          className={`animate-spin rounded-full border-slate-700 border-t-brand ${sizes[size]}`}
        />
        <div
          className={`absolute inset-0 animate-ping rounded-full border-brand/20 ${sizes[size]} opacity-20`}
        />
      </div>
      {text && (
        <p className="animate-pulse text-sm text-slate-400">{text}</p>
      )}
    </div>
  );
};

export default Loader;