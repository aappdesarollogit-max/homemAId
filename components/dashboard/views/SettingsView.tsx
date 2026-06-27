import Link from "next/link";
import SectionHeader from "@/components/dashboard/SectionHeader";
import Badge from "@/components/ui/Badge";
import { settingsSections } from "@/lib/dashboard-utils";
import { formatCurrency, householdMembers, householdSummary } from "@/lib/mock-home";

export default function SettingsView({
  activeSettingsSection,
}: {
  activeSettingsSection?: string;
}) {
  return (
    <>
      <SectionHeader
        eyebrow="Ajustes"
        title="Configuración del hogar"
        description="Base para gestionar hogar, integrantes, presupuesto y preferencias."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {settingsSections.map((section) => (
          <Link key={section.id} href={`/dashboard?view=ajustes&settings=${section.id}`}>
            <Badge tone={activeSettingsSection === section.id ? "violet" : "slate"}>
              {section.label}
            </Badge>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">{householdSummary.name}</h2>
          <p className="mt-2 text-sm text-white/55">Presupuesto mensual</p>
          <p className="mt-1 text-3xl font-black">{formatCurrency(householdSummary.monthlyBudget)}</p>
          <div className="mt-6">
            <Badge tone="violet">{householdMembers.length} integrantes</Badge>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          {activeSettingsSection === "integrantes" ? (
            <>
              <h2 className="text-2xl font-black">Integrantes</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {householdMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500 font-black">
                      {member.avatar}
                    </span>
                    <div>
                      <p className="font-black">{member.name}</p>
                      <p className="text-sm text-white/50">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : activeSettingsSection === "presupuesto" ? (
            <>
              <h2 className="text-2xl font-black">Presupuesto</h2>
              <p className="mt-2 text-sm text-white/55">
                Control mensual base para medir gasto y ahorro.
              </p>
              <div className="mt-6 rounded-3xl bg-white p-6 text-slate-950">
                <p className="text-sm font-bold text-slate-500">Presupuesto mensual</p>
                <p className="mt-2 text-4xl font-black text-violet-600">
                  {formatCurrency(householdSummary.monthlyBudget)}
                </p>
                <div className="mt-6 h-3 rounded-full bg-slate-100">
                  <div className="h-full w-[72%] rounded-full bg-violet-500" />
                </div>
                <p className="mt-3 text-sm font-bold text-slate-500">
                  {formatCurrency(householdSummary.monthlySpend)} gastados este mes
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-black">Información del hogar</h2>
              <div className="mt-5 space-y-3">
                {[
                  ["Nombre", householdSummary.name],
                  ["Responsable", householdSummary.owner],
                  ["Score del hogar", `${householdSummary.healthScore}/100`],
                  ["Ahorro estimado", formatCurrency(householdSummary.estimatedSavings)],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
                    <span className="text-sm font-bold text-white/55">{label}</span>
                    <span className="font-black">{value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}
