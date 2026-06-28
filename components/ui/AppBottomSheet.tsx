type AppBottomSheetProps = {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

export default function AppBottomSheet({
  isOpen,
  title,
  children,
  onClose,
}: AppBottomSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/75 px-3 pb-3 pt-16 backdrop-blur-sm xl:hidden">
      <div className="relative w-full overflow-hidden rounded-[32px] shadow-2xl shadow-black/40">
        <button
          type="button"
          onClick={onClose}
          aria-label={`Cerrar ${title}`}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-black text-slate-700 shadow-lg shadow-slate-950/10 transition active:scale-95"
        >
          x
        </button>
        {children}
      </div>
    </div>
  );
}
