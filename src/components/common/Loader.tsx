const Loader = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizes = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-16 w-16 border-4"
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-slate-600 border-t-rose-600 ${sizes[size]}`}
      ></div>
    </div>
  );
};

export default Loader;