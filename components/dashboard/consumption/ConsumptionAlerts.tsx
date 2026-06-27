import type { ConsumptionAlert } from "@/lib/services/consumption-service";

type ConsumptionAlertsProps = {
  alerts: ConsumptionAlert[];
};

const alertClassNames = {
  danger: "bg-red-500/15 text-red-100",
  warning: "bg-orange-500/15 text-orange-100",
  info: "bg-violet-500/15 text-violet-100",
};

export default function ConsumptionAlerts({ alerts }: ConsumptionAlertsProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <h2 className="text-2xl font-black">Alertas</h2>
      <div className="mt-5 space-y-3">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div key={alert.id} className={`rounded-2xl p-4 ${alertClassNames[alert.tone]}`}>
              <p className="font-black">{alert.title}</p>
              <p className="mt-1 text-sm font-semibold opacity-80">{alert.description}</p>
            </div>
          ))
        ) : (
          <p className="text-sm font-bold text-white/55">Sin alertas por ahora.</p>
        )}
      </div>
    </section>
  );
}
