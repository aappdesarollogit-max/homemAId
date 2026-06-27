import { formatCurrency } from "@/lib/mock-home";

type BudgetSummaryProps = {
  monthlySpend: number;
  monthlyBudget: number;
  budgetUsage: number;
};

export default function BudgetSummary({
  monthlySpend,
  monthlyBudget,
  budgetUsage,
}: BudgetSummaryProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <p className="text-sm font-bold text-white/55">Gasto del mes</p>
      <p className="mt-2 text-4xl font-black">{formatCurrency(monthlySpend)}</p>
      <p className="mt-2 text-sm font-bold text-red-300">
        {budgetUsage}% del presupuesto mensual
      </p>
      <div className="mt-6 h-3 rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-violet-500"
          style={{ width: `${Math.min(100, budgetUsage)}%` }}
        />
      </div>
      <div className="mt-4 flex items-center justify-between text-sm font-bold text-white/55">
        <span>Presupuesto</span>
        <span>{formatCurrency(monthlyBudget)}</span>
      </div>
    </section>
  );
}
