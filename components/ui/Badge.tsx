import AppChip from "@/components/ui/AppChip";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "violet" | "green" | "orange" | "red" | "slate";
};

export default function Badge({ children, tone = "slate" }: BadgeProps) {
  return <AppChip tone={tone}>{children}</AppChip>;
}
