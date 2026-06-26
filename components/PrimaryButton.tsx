import Link from "next/link";

type PrimaryButtonProps = {
  text: string;
  href?: string;
  className?: string;
};

export default function PrimaryButton({
  text,
  href = "/registro",
  className = "",
}: PrimaryButtonProps) {
  return (
    <Link
      href={href}
      className={`rounded-xl bg-orange-500 px-6 py-3 text-center font-semibold text-white transition hover:bg-orange-600 ${className}`}
    >
      {text}
    </Link>
  );
}
