import DashboardShell from "@/components/dashboard/DashboardShell";
import AssistantView from "@/components/dashboard/views/AssistantView";
import ConsumptionView from "@/components/dashboard/views/ConsumptionView";
import InventoryView from "@/components/dashboard/views/InventoryView";
import OverviewView from "@/components/dashboard/views/OverviewView";
import PurchasesView from "@/components/dashboard/views/PurchasesView";
import SettingsView from "@/components/dashboard/views/SettingsView";
import {
  resolveInventoryAction,
  resolveInventoryFilter,
  resolveProductId,
  resolvePromptId,
  resolvePurchaseId,
  resolvePurchaseMode,
  resolveSettingsSection,
  resolveView,
} from "@/lib/dashboard-utils";
import type { DashboardView } from "@/types/domain";

type DashboardPageProps = {
  searchParams?: Promise<{
    view?: string;
    filter?: string;
    purchase?: string;
    product?: string;
    prompt?: string;
    action?: string;
    mode?: string;
    settings?: string;
  }>;
};

function renderView(
  view: DashboardView,
  activeFilter: string,
  selectedPurchaseId?: string,
  selectedProductId?: string,
  selectedPromptId?: string,
  activeAction?: string,
  activeMode?: string,
  activeSettingsSection?: string,
) {
  if (view === "inventario") {
    return (
      <InventoryView
        activeFilter={activeFilter}
        selectedProductId={selectedProductId}
        activeAction={activeAction}
      />
    );
  }

  if (view === "compras") {
    return (
      <PurchasesView
        selectedPurchaseId={selectedPurchaseId}
        activeMode={activeMode}
      />
    );
  }

  if (view === "consumo") return <ConsumptionView />;
  if (view === "asistente") return <AssistantView selectedPromptId={selectedPromptId} />;
  if (view === "ajustes") {
    return <SettingsView activeSettingsSection={activeSettingsSection} />;
  }

  return <OverviewView />;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const activeView = resolveView(params?.view);
  const activeFilter = resolveInventoryFilter(params?.filter);
  const selectedPurchaseId = resolvePurchaseId(params?.purchase);
  const selectedProductId = resolveProductId(params?.product);
  const selectedPromptId = resolvePromptId(params?.prompt);
  const activeAction = resolveInventoryAction(params?.action);
  const activeMode = resolvePurchaseMode(params?.mode);
  const activeSettingsSection = resolveSettingsSection(params?.settings);

  return (
    <DashboardShell activeView={activeView}>
      {renderView(
        activeView,
        activeFilter,
        selectedPurchaseId,
        selectedProductId,
        selectedPromptId,
        activeAction,
        activeMode,
        activeSettingsSection,
      )}
    </DashboardShell>
  );
}
