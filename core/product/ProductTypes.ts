export type FeedbackType =
  | "BUG"
  | "MEJORA"
  | "IDEA"
  | "CONFUSIÓN"
  | "PREGUNTA"
  | "PERFORMANCE"
  | "UX"
  | "OTRO";

export type ProductStatus =
  | "Nuevo"
  | "En revisión"
  | "Aceptado"
  | "Rechazado"
  | "En desarrollo"
  | "Resuelto"
  | "Liberado";

export type ProductPriority = "Crítica" | "Alta" | "Media" | "Baja";

export type Feedback = {
  id: string;
  usuario: string;
  fecha: string;
  pantalla: string;
  version: string;
  tipo: FeedbackType;
  descripcion: string;
  queEsperaba: string;
  prioridad: ProductPriority;
  estado: ProductStatus;
  captura?: string;
  logs?: string;
};

export type BugReport = {
  id: string;
  error: string;
  stack?: string;
  pantalla: string;
  accion: string;
  usuario: string;
  fecha: string;
  prioridad: ProductPriority;
  estado: ProductStatus;
  feedbackId?: string;
};

export type FeatureRequest = {
  id: string;
  idea: string;
  usuario: string;
  impacto: ProductPriority;
  frecuencia: number;
  beneficio: string;
  estado: ProductStatus;
  feedbackId?: string;
  fecha: string;
};

export type ProductDecision = {
  id: string;
  feedbackId: string;
  decision:
    | "No hacer nada"
    | "Corregir bug"
    | "Crear feature"
    | "Mover al backlog"
    | "Duplicado"
    | "Ya resuelto";
  motivo: string;
  fecha: string;
};

export type RoadmapItem = {
  id: string;
  titulo: string;
  descripcion: string;
  prioridad: ProductPriority;
  fuente: string;
  votos: number;
  estado: ProductStatus;
};

export type AnalyticsEvent = {
  id: string;
  tipo:
    | "pantalla.visitada"
    | "parser.usado"
    | "parser.fallo"
    | "compra.creada"
    | "compra.cancelada"
    | "feedback.enviado"
    | "asistente.usado"
    | "first_run_started"
    | "onboarding_completed"
    | "demo_selected"
    | "empty_home_selected"
    | "welcome_completed";
  pantalla?: string;
  usuario?: string;
  fecha: string;
  metadata?: Record<string, string | number | boolean | undefined>;
};

export type ProductSnapshot = {
  feedback: Feedback[];
  bugs: BugReport[];
  featureRequests: FeatureRequest[];
  decisions: ProductDecision[];
  analytics: AnalyticsEvent[];
};
