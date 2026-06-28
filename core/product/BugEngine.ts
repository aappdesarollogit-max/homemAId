import { appendBug, createProductId, getProductSnapshot } from "@/core/product/ProductStorage";
import type { BugReport, ProductPriority } from "@/core/product/ProductTypes";

export type BugReportDraft = Omit<BugReport, "id" | "fecha" | "estado" | "prioridad"> & {
  fecha?: string;
  prioridad?: ProductPriority;
};

export default class BugEngine {
  createBugReport(draft: BugReportDraft) {
    const bug: BugReport = {
      ...draft,
      id: createProductId("bug"),
      fecha: draft.fecha ?? new Date().toISOString(),
      prioridad: draft.prioridad ?? "Media",
      estado: "Nuevo",
    };

    appendBug(bug);
    return bug;
  }

  getBugs() {
    return getProductSnapshot().bugs;
  }

  getCriticalBugs() {
    return this.getBugs().filter((bug) => bug.prioridad === "Crítica");
  }
}
