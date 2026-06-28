type AppInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function AppInput({ className = "", ...props }: AppInputProps) {
  return (
    <input
      {...props}
      className={`min-touch w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white outline-none shadow-lg shadow-black/5 placeholder:text-white/35 transition duration-200 ease-out focus:border-violet-300 focus:bg-white/[0.07] focus:ring-4 focus:ring-violet-500/10 ${className}`}
    />
  );
}
