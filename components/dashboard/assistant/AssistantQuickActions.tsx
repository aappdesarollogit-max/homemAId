"use client";

type AssistantQuickAction = {
  id: string;
  label: string;
  message: string;
};

type AssistantQuickActionsProps = {
  actions: AssistantQuickAction[];
  onSelect: (message: string) => void;
  onClear: () => void;
};

export default function AssistantQuickActions({
  actions,
  onSelect,
  onClear,
}: AssistantQuickActionsProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-black">Sugerencias rápidas</h2>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-black text-white/45 hover:text-white"
        >
          Limpiar
        </button>
      </div>
      <div className="mt-5 space-y-3">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => onSelect(action.message)}
            className="block w-full rounded-2xl bg-white/5 p-4 text-left text-sm font-bold transition hover:bg-white/10"
          >
            {action.message}
          </button>
        ))}
      </div>
    </section>
  );
}
