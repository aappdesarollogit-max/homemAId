import { designTokens } from "@/styles/design-tokens";

type AppCardProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "aside";
};

export default function AppCard({ children, className = "", as = "div" }: AppCardProps) {
  const Component = as;

  return (
    <Component
      className={`${designTokens.radius.card} border ${designTokens.colors.border} ${designTokens.colors.surface} ${designTokens.shadow.card} ${className}`}
    >
      {children}
    </Component>
  );
}
