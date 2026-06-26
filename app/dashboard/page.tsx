import Link from "next/link";
import Badge from "@/components/ui/Badge";
import MetricCard from "@/components/dashboard/MetricCard";
import SectionHeader from "@/components/dashboard/SectionHeader";
import {
  aiInsights,
  dashboardViews,
  formatCurrency,
  householdMembers,
  householdSummary,
  inventoryProducts,
  purchases,
} from "@/lib/mock-home";
import type { DashboardView, InventoryProduct, ProductStatus } from "@/types/domain";

type DashboardPageProps = {
  searchParams?: Promise<{
    view?: string;
    filter?: string;
  }>;
};

const validViews = new Set<DashboardView>([
  "inicio",
  "inventario",
  "compras",
  "consumo",
  "asistente",
  "ajustes",
]);

function resolveView(view?: string): DashboardView {
  return validViews.has(view as DashboardView) ? (view as DashboardView) : "inicio";
}

const inventoryFilters = [
  { id: "todos", label: "Todos" },
  { id: "despensa", label: "Despensa" },
  { id: "lacteos", label: "Lácteos" },
  { id: "limpieza", label: "Limpieza" },
  { id: "criticos", label: "Críticos" },
];

function resolveInventoryFilter(filter?: string): string {
  return inventoryFilters.some((item) => item.id === filter) ? String(filter) : "todos";
}

function filterInventoryProducts(filter: string) {
  if (filter === "criticos") {
    return inventoryProducts.filter((product) => product.status !== "ok");
  }

  if (filter === "despensa") {
    return inventoryProducts.filter((product) => product.category === "Despensa");
  }

  if (filter === "lacteos") {
    return inventoryProducts.filter((product) => product.category === "Lácteos");
  }

  if (filter === "limpieza") {
    return inventoryProducts.filter((product) => product.category === "Limpieza");
  }

  return inventoryProducts;
}

function AppLogo() {
  return (
    <Link href="/" className="mb-10 flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-fuchsia-500 text-2xl shadow-lg shadow-violet-900/40">
        ⌂
      </div>
      <span className="text-2xl font-black">
        Home<span className="text-violet-400">Maid</span>
      </span>
    </Link>
  );
}

function DashboardShell({
  activeView,
  children,
}: {
  activeView: DashboardView;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#050713] text-white">
      <div className="flex">
        <aside className="hidden min-h-screen w-72 border-r border-white/10 bg-[#080b19] p-6 lg:block">
          <AppLogo />

          <nav aria-label="Navegación del panel" className="space-y-2 text-sm">
            {dashboardViews.map((item) => {
              const isActive = item.id === activeView;

              return (
                <Link
                  key={item.id}
                  href={`/dashboard?view=${item.id}`}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition ${
                    isActive
                      ? "bg-violet-500 text-white shadow-lg shadow-violet-950/30"
                      : "text-white/65 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-lg font-black">MVP HomeMaid</p>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              Base navegable lista para conectar formularios, base de datos e IA.
            </p>
          </div>
        </aside>

        <section className="min-h-screen w-full p-5 md:p-8 lg:p-10">
          <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
            <AppLogo />
            <Link
              href="/"
              className="rounded-full bg-white px-4 py-2 text-sm font-black text-violet-700"
            >
              Inicio
            </Link>
          </div>

          <div className="mb-8 flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {dashboardViews.map((item) => (
              <Link
                key={item.id}
                href={`/dashboard?view=${item.id}`}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-black ${
                  item.id === activeView
                    ? "bg-violet-500 text-white"
                    : "bg-white/10 text-white/70"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {children}
        </section>
      </div>
    </main>
  );
}

function statusTone(status: ProductStatus) {
  if (status === "critical") return "red";
  if (status === "low") return "orange";
  return "green";
}

function InventoryRow({ product }: { product: InventoryProduct }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl">
          {product.icon}
        </div>
        <div>
          <p className="font-black text-white">{product.name}</p>
          <p className="mt-1 text-sm text-white/50">
            {product.category} · {product.quantity}
          </p>
        </div>
      </div>
      <div className="text-right">
        <Badge tone={statusTone(product.status)}>{product.statusLabel}</Badge>
        <p className="mt-2 text-xs font-semibold text-white/45">
          {product.estimatedDaysLeft} días estimados
        </p>
      </div>
    </div>
  );
}

function OverviewView() {
  const budgetUsage = Math.round(
    (householdSummary.monthlySpend / householdSummary.monthlyBudget) * 100,
  );
  const urgentProducts = inventoryProducts.filter((product) => product.status !== "ok");

  return (
    <>
      <SectionHeader
        eyebrow={householdSummary.name}
        title={`¡Hola, ${householdSummary.owner}!`}
        description="Aquí tienes el estado actualizado del hogar: inventario, compras, consumo y recomendaciones."
        action={
          <Link
            href="/dashboard?view=inventario"
            className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-950/30 hover:bg-violet-400"
          >
            Ver inventario
          </Link>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon="▤"
          label="Productos"
          value={String(inventoryProducts.length)}
          note="Total en inventario"
          tone="violet"
        />
        <MetricCard
          icon="!"
          label="Por revisar"
          value={String(urgentProducts.length)}
          note="Requieren atención"
          tone="orange"
        />
        <MetricCard
          icon="$"
          label="Gasto mensual"
          value={formatCurrency(householdSummary.monthlySpend)}
          note={`${budgetUsage}% del presupuesto`}
          tone="pink"
        />
        <MetricCard
          icon="✓"
          label="Score del hogar"
          value={`${householdSummary.healthScore}/100`}
          note="Muy buen estado"
          tone="green"
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black">Inventario crítico</h2>
            <Link href="/dashboard?view=inventario" className="text-sm font-black text-violet-300">
              Ver todo
            </Link>
          </div>
          <div className="space-y-3">
            {urgentProducts.map((product) => (
              <InventoryRow key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-violet-500 p-6 shadow-2xl shadow-violet-950/30">
          <h2 className="text-2xl font-black">Recomendaciones IA</h2>
          <div className="mt-5 space-y-4">
            {aiInsights.map((insight) => (
              <div key={insight.id} className="rounded-2xl bg-black/20 p-4">
                <p className="font-black">{insight.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-violet-50">{insight.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function InventoryView({ activeFilter }: { activeFilter: string }) {
  const filteredProducts = filterInventoryProducts(activeFilter);

  return (
    <>
      <SectionHeader
        eyebrow="Inventario"
        title="Productos del hogar"
        description="Vista central para controlar stock, productos abiertos y próximos agotamientos."
        action={
          <button className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-black text-white">
            + Agregar producto
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {inventoryFilters.map((filter) => (
          <Link key={filter.id} href={`/dashboard?view=inventario&filter=${filter.id}`}>
            <Badge tone={activeFilter === filter.id ? "violet" : "slate"}>
              {filter.label}
            </Badge>
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        {filteredProducts.map((product) => (
          <InventoryRow key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}

function PurchasesView() {
  return (
    <>
      <SectionHeader
        eyebrow="Compras"
        title="Registro de compras"
        description="Historial de compras recientes y productos que luego alimentarán el inventario."
        action={
          <button className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-black text-white">
            + Nueva compra
          </button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {purchases.map((purchase) => (
          <article key={purchase.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xl font-black">{purchase.store}</p>
                <p className="mt-1 text-sm text-white/50">{purchase.date}</p>
              </div>
              <p className="font-black text-violet-300">{formatCurrency(purchase.total)}</p>
            </div>
            <div className="mt-5 space-y-3">
              {purchase.items.map((item) => (
                <div key={item.productName} className="rounded-2xl bg-white/5 p-4">
                  <p className="font-bold">{item.productName}</p>
                  <p className="mt-1 text-sm text-white/50">
                    {item.quantity} · {formatCurrency(item.price)}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function ConsumptionView() {
  const budgetUsage = Math.round(
    (householdSummary.monthlySpend / householdSummary.monthlyBudget) * 100,
  );

  return (
    <>
      <SectionHeader
        eyebrow="Consumo"
        title="Dashboard de consumo"
        description="Resumen de gasto mensual, presupuesto y categorías principales."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm font-bold text-white/55">Gasto del mes</p>
          <p className="mt-2 text-4xl font-black">{formatCurrency(householdSummary.monthlySpend)}</p>
          <p className="mt-2 text-sm font-bold text-red-300">
            {budgetUsage}% del presupuesto mensual
          </p>
          <div className="mt-8 flex h-52 items-end gap-3">
            {[45, 58, 42, 50, 66, 46, 76, 54, 88, 72].map((height, index) => (
              <span
                key={`${height}-${index}`}
                className="w-full rounded-t-2xl bg-violet-500"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">Categorías</h2>
          <div className="mt-5 space-y-4">
            {[
              ["Alimentos", 250000, 58],
              ["Limpieza", 80000, 19],
              ["Mascotas", 52000, 12],
              ["Otros", 50000, 11],
            ].map(([label, amount, percentage]) => (
              <div key={label} className="rounded-2xl bg-white/5 p-4">
                <div className="flex justify-between text-sm font-black">
                  <span>{label}</span>
                  <span>{formatCurrency(Number(amount))}</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-violet-400"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function AssistantView() {
  return (
    <>
      <SectionHeader
        eyebrow="Asistente IA"
        title="Consulta tu hogar"
        description="Primer borrador de la experiencia conversacional. Luego conectaremos lenguaje natural real."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="space-y-4">
            <div className="max-w-md rounded-3xl bg-white p-4 text-slate-950">
              <p className="text-sm font-bold">¡Hola! ¿En qué puedo ayudarte hoy?</p>
            </div>
            <div className="ml-auto max-w-md rounded-3xl bg-violet-500 p-4">
              <p className="text-sm font-bold">Compré 2 leches y un detergente</p>
            </div>
            <div className="max-w-md rounded-3xl bg-white p-4 text-slate-950">
              <p className="text-sm font-bold">
                Listo. Registré la compra por {formatCurrency(7990)} y actualicé el inventario.
              </p>
            </div>
          </div>
          <div className="mt-8 rounded-2xl bg-white px-4 py-4 text-sm text-slate-400">
            Escribe un mensaje...
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">Sugerencias rápidas</h2>
          <div className="mt-5 space-y-3">
            {[
              "¿Qué productos están por agotarse?",
              "Registra una compra de supermercado",
              "¿Cuánto gasté este mes?",
              "Sugiere una lista para la semana",
            ].map((prompt) => (
              <button
                key={prompt}
                className="w-full rounded-2xl bg-white/5 p-4 text-left text-sm font-bold hover:bg-white/10"
              >
                {prompt}
              </button>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function SettingsView() {
  return (
    <>
      <SectionHeader
        eyebrow="Ajustes"
        title="Configuración del hogar"
        description="Base para gestionar hogar, integrantes, presupuesto y preferencias."
      />

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
        </section>
      </div>
    </>
  );
}

function renderView(view: DashboardView, activeFilter: string) {
  if (view === "inventario") return <InventoryView activeFilter={activeFilter} />;
  if (view === "compras") return <PurchasesView />;
  if (view === "consumo") return <ConsumptionView />;
  if (view === "asistente") return <AssistantView />;
  if (view === "ajustes") return <SettingsView />;
  return <OverviewView />;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const activeView = resolveView(params?.view);
  const activeFilter = resolveInventoryFilter(params?.filter);

  return (
    <DashboardShell activeView={activeView}>
      {renderView(activeView, activeFilter)}
    </DashboardShell>
  );
}
