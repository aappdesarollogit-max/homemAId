type AppHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function AppHeader({ eyebrow, title, description, action }: AppHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-300">{eyebrow}</p>
        ) : null}
        <h1 className="mt-2 text-3xl font-black tracking-normal text-white sm:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
