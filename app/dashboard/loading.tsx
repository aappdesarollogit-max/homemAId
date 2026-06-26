function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-3xl bg-white/10 ${className}`} />;
}

export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[#050713] text-white">
      <div className="flex">
        <aside className="hidden min-h-screen w-72 border-r border-white/10 bg-[#080b19] p-6 lg:block">
          <div className="mb-10 flex items-center gap-3">
            <SkeletonBlock className="h-12 w-12 rounded-2xl" />
            <SkeletonBlock className="h-8 w-36" />
          </div>

          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-14 w-full rounded-2xl" />
            ))}
          </div>

          <SkeletonBlock className="mt-12 h-36 w-full" />
        </aside>

        <section className="w-full p-5 md:p-8 lg:p-10">
          <div className="mb-8">
            <SkeletonBlock className="h-4 w-40" />
            <SkeletonBlock className="mt-4 h-11 w-72 max-w-full" />
            <SkeletonBlock className="mt-4 h-5 w-[520px] max-w-full" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-44" />
            ))}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <SkeletonBlock className="h-96" />
            <SkeletonBlock className="h-96" />
          </div>
        </section>
      </div>
    </main>
  );
}
