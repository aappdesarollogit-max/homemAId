type AppEmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export default function AppEmptyState({ title, description, action }: AppEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-xl shadow-black/10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-400/30 to-fuchsia-400/20 text-violet-100 ring-1 ring-white/10">
        <svg aria-hidden="true" className="h-8 w-8" viewBox="0 0 24 24" fill="none">
          <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="m4 8.5 8 4.5 8-4.5M12 13v7" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </div>
      <h3 className="mt-5 text-xl font-black text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/55">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
