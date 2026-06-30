"use client";

import { useMemo, useState } from "react";
import AlphaNotice from "@/components/dashboard/AlphaNotice";
import AnalyticsEngine from "@/core/product/AnalyticsEngine";
import FeedbackEngine from "@/core/product/FeedbackEngine";
import RoadmapEngine from "@/core/product/RoadmapEngine";
import { getProductSnapshot } from "@/core/product/ProductStorage";
import { releaseInfo } from "@/lib/release";

function downloadTextFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ProductView() {
  const [snapshot, setSnapshot] = useState(() => getProductSnapshot());
  const analyticsEngine = useMemo(() => new AnalyticsEngine(), []);
  const feedbackEngine = useMemo(() => new FeedbackEngine(), []);
  const roadmapEngine = useMemo(() => new RoadmapEngine(), []);
  const kpis = analyticsEngine.getKpis();
  const qualityMetrics = analyticsEngine.getQualityMetrics();
  const roadmap = roadmapEngine.generateRoadmap();
  const recentFeedback = snapshot.feedback.slice(0, 6);
  const criticalBugs = snapshot.bugs.filter((bug) => bug.prioridad === "Crítica");
  const ideas = snapshot.feedback.filter((feedback) => feedback.tipo === "IDEA");
  const highPriority = snapshot.feedback.filter((feedback) =>
    ["Crítica", "Alta"].includes(feedback.prioridad),
  );

  function exportFeedback(format: "json" | "csv") {
    downloadTextFile(
      `homemaid-feedback.${format}`,
      feedbackEngine.export(format),
      format === "json" ? "application/json" : "text/csv",
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-300">
            {releaseInfo.releaseName} · {releaseInfo.appVersion}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-normal text-white sm:text-4xl">
            Product Intelligence
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/55">
            Feedback, bugs, ideas, prioridades y roadmap sugerido para la Alpha Cerrada.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => exportFeedback("json")}
            className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-violet-700"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => exportFeedback("csv")}
            className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-black text-white"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => setSnapshot(getProductSnapshot())}
            className="rounded-2xl bg-violet-500 px-4 py-3 text-sm font-black text-white"
          >
            Actualizar
          </button>
        </div>
      </div>

      <AlphaNotice className="mb-6" />

      <section className="mb-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <h2 className="text-2xl font-black">Quality Dashboard</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ["Parser Success", qualityMetrics.parserSuccess],
            ["Parser Fail", qualityMetrics.parserFail],
            ["Onboarding Completion", `${qualityMetrics.onboardingCompletion}%`],
            ["Feedback enviados", qualityMetrics.feedbackEnviados],
            ["Errores críticos", qualityMetrics.erroresCriticos],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white/5 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-white/40">
                {label}
              </p>
              <p className="mt-2 text-2xl font-black">{String(value)}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Release", releaseInfo.releaseName],
          ["Build", releaseInfo.buildDate],
          ["Feedback abiertos", kpis.feedbackAbiertos],
          ["Feedback resueltos", kpis.feedbackResueltos],
          ["Bugs críticos", kpis.bugsCriticos],
          ["Ideas", kpis.ideas],
          ["Parser fallidos", kpis.parserFallidos],
          ["Parser exitosos", kpis.parserExitosos],
          ["Usuarios Alpha", kpis.usuariosAlpha],
          ["Versión", kpis.version],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/45">
              {label}
            </p>
            <p className="mt-2 text-2xl font-black">{String(value)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">Feedback recientes</h2>
          <div className="mt-5 space-y-3">
            {recentFeedback.length > 0 ? (
              recentFeedback.map((feedback) => (
                <div key={feedback.id} className="rounded-2xl bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black">{feedback.tipo} · {feedback.pantalla}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/55">
                        {feedback.descripcion}
                      </p>
                    </div>
                    <span className="text-xs font-black text-violet-300">
                      {feedback.prioridad}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm font-bold text-white/55">Aún no hay feedback.</p>
            )}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Prioridades</h2>
            <div className="mt-5 space-y-3">
              {highPriority.length > 0 ? (
                highPriority.slice(0, 5).map((feedback) => (
                  <div key={feedback.id} className="rounded-2xl bg-white/5 p-4">
                    <p className="font-black">{feedback.prioridad}</p>
                    <p className="mt-1 text-sm text-white/55">{feedback.descripcion}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm font-bold text-white/55">Sin prioridades altas.</p>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Bugs e ideas</h2>
            <div className="mt-5 grid gap-3">
              <p className="rounded-2xl bg-red-500/10 p-4 text-sm font-black text-red-100">
                Bugs críticos: {criticalBugs.length}
              </p>
              <p className="rounded-2xl bg-violet-500/10 p-4 text-sm font-black text-violet-100">
                Ideas registradas: {ideas.length + snapshot.featureRequests.length}
              </p>
            </div>
          </section>
        </div>
      </div>

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <h2 className="text-2xl font-black">Roadmap sugerido</h2>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {roadmap.length > 0 ? (
            roadmap.slice(0, 8).map((item) => (
              <div key={item.id} className="rounded-2xl bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black">{item.titulo}</p>
                    <p className="mt-1 text-sm text-white/55">{item.descripcion}</p>
                  </div>
                  <span className="text-xs font-black text-violet-300">{item.prioridad}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm font-bold text-white/55">
              El roadmap se generará cuando exista feedback suficiente.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
