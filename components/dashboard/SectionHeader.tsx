type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: SectionHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-300">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 text-4xl font-black tracking-normal text-white">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">{description}</p>
      </div>
      {action}
    </div>
  );
}
