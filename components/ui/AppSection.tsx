type AppSectionProps = {
  children: React.ReactNode;
  className?: string;
};

export default function AppSection({ children, className = "" }: AppSectionProps) {
  return <section className={`space-y-5 ${className}`}>{children}</section>;
}
