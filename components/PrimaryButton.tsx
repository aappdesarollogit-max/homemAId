import Link from "next/link";

type PrimaryButtonProps = {
  text: string;
  href?: string;
};

export default function PrimaryButton({ text, href = "/registro" }: PrimaryButtonProps) {
  return (
    <Link
      href={href}
      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition text-center"
    >
      {text}
    </Link>
  );
}