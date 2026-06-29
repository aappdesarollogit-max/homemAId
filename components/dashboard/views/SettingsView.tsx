"use client";

import Link from "next/link";
import AlphaNotice from "@/components/dashboard/AlphaNotice";
import BudgetSettings from "@/components/dashboard/settings/BudgetSettings";
import FeedbackForm from "@/components/dashboard/settings/FeedbackForm";
import HouseholdForm from "@/components/dashboard/settings/HouseholdForm";
import MembersManager from "@/components/dashboard/settings/MembersManager";
import PreferencesForm from "@/components/dashboard/settings/PreferencesForm";
import SettingsSummary from "@/components/dashboard/settings/SettingsSummary";
import SectionHeader from "@/components/dashboard/SectionHeader";
import Badge from "@/components/ui/Badge";
import { usePurchases } from "@/hooks/usePurchases";
import { useSettings } from "@/hooks/useSettings";
import { settingsSections } from "@/lib/dashboard-utils";
import { householdSummary } from "@/lib/mock-home";
import { releaseInfo } from "@/lib/release";

export default function SettingsView({
  activeSettingsSection,
}: {
  activeSettingsSection?: string;
}) {
  const {
    settings,
    members,
    updateSettings,
    createMember,
    updateMember,
    deleteMember,
    resetSettings,
  } = useSettings();
  const { monthlySpend } = usePurchases();
  const activeSettings = settings ?? {
    name: householdSummary.name,
    owner: householdSummary.owner,
    monthlyBudget: householdSummary.monthlyBudget,
    currency: "CLP",
    language: "Español",
    budgetAlertThreshold: 80,
    favoriteStores: ["Supermercado"],
    priorityCategories: ["Despensa", "Lácteos", "Limpieza"],
    purchaseFrequency: "Semanal",
  };

  return (
    <>
      <SectionHeader
        eyebrow="Ajustes"
        title="Configuración del hogar"
        description="Gestiona datos del hogar, integrantes, presupuesto y preferencias."
        action={
          <button
            type="button"
            onClick={resetSettings}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-violet-700"
          >
            Restaurar
          </button>
        }
      />

      <AlphaNotice className="mb-4" />

      <div className="mb-6 grid gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/70 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-white/40">
            Version
          </p>
          <p className="mt-1 font-black text-white">{releaseInfo.appVersion}</p>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-white/40">
            Release
          </p>
          <p className="mt-1 font-black text-white">{releaseInfo.releaseName}</p>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-white/40">
            Build
          </p>
          <p className="mt-1 font-black text-white">{releaseInfo.buildDate}</p>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-white/40">
            Commit
          </p>
          <p className="mt-1 truncate font-black text-white">
            {releaseInfo.gitCommit?.slice(0, 7) ?? "No disponible"}
          </p>
        </div>
      </div>

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
        <SettingsSummary settings={activeSettings} members={members} />

        <div className="space-y-6">
          {activeSettingsSection === "integrantes" ? (
            <MembersManager
              members={members}
              onCreate={createMember}
              onUpdate={updateMember}
              onDelete={deleteMember}
            />
          ) : activeSettingsSection === "presupuesto" ? (
            <BudgetSettings
              settings={activeSettings}
              monthlySpend={monthlySpend}
              onSave={updateSettings}
            />
          ) : activeSettingsSection === "preferencias" ? (
            <PreferencesForm settings={activeSettings} onSave={updateSettings} />
          ) : activeSettingsSection === "feedback" ? (
            <FeedbackForm />
          ) : (
            <HouseholdForm settings={activeSettings} onSave={updateSettings} />
          )}
        </div>
      </div>
    </>
  );
}
