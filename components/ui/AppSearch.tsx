type AppSearchProps = React.InputHTMLAttributes<HTMLInputElement>;

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M10.8 18.1a7.3 7.3 0 1 0 0-14.6 7.3 7.3 0 0 0 0 14.6Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="m16.3 16.3 4.2 4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function AppSearch({ className = "", ...props }: AppSearchProps) {
  return (
    <label className={`min-touch flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white shadow-xl shadow-black/10 transition duration-200 ease-out focus-within:border-violet-300 focus-within:bg-white/[0.08] focus-within:ring-4 focus-within:ring-violet-500/10 ${className}`}>
      <span className="text-white/45">
        <SearchIcon />
      </span>
      <input
        {...props}
        className="min-w-0 flex-1 bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/35"
      />
    </label>
  );
}
