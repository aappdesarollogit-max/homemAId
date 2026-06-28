import Badge from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/mock-home";
import type { HouseholdMember, HouseholdSettings } from "@/types/domain";

type SettingsSummaryProps = {
  settings: HouseholdSettings;
  members: HouseholdMember[];
};

export default function SettingsSummary({ settings, members }: SettingsSummaryProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <h2 className="text-2xl font-black">{settings.name}</h2>
      <p className="mt-2 text-sm text-white/55">Presupuesto mensual</p>
      <p className="mt-1 text-3xl font-black">{formatCurrency(settings.monthlyBudget)}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Badge tone="violet">{members.length} integrantes</Badge>
        <Badge tone="slate">{settings.currency}</Badge>
        <Badge tone="slate">{settings.language}</Badge>
      </div>
    </section>
  );
}
