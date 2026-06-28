type AppButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

const variantClassNames = {
  primary: "bg-violet-500 text-white shadow-lg shadow-violet-950/30 hover:bg-violet-400",
  secondary: "border border-white/10 bg-white/5 text-white hover:bg-white/10",
  danger: "bg-red-500/15 text-red-100 hover:bg-red-500/25",
};

export default function AppButton({
  variant = "primary",
  className = "",
  ...props
}: AppButtonProps) {
  return (
    <button
      {...props}
      className={`min-touch rounded-2xl px-5 py-3 text-sm font-black transition duration-200 ease-out active:scale-[0.98] ${variantClassNames[variant]} ${className}`}
    />
  );
}
