"use client";

type AssistantInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
};

export default function AssistantInput({
  value,
  onChange,
  onSend,
}: AssistantInputProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSend(value);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex gap-3">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Escribe un mensaje..."
        className="min-w-0 flex-1 rounded-2xl bg-white px-4 py-4 text-sm font-bold text-slate-950 outline-none placeholder:text-slate-400"
      />
      <button
        type="submit"
        className="rounded-2xl bg-violet-500 px-5 py-4 text-sm font-black text-white hover:bg-violet-400"
      >
        Enviar
      </button>
    </form>
  );
}
