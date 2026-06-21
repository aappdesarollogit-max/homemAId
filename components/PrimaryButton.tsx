type PrimaryButtonProps = {
  text: string;
};

export default function PrimaryButton({ text }: PrimaryButtonProps) {
  return (
    <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition">
      {text}
    </button>
  );
}