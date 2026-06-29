# Architecture

## Capas

- `app/`: rutas Next.js y composicion de pantallas.
- `components/`: UI reutilizable.
- `hooks/`: estado cliente por modulo.
- `core/knowledge/`: plataforma de conocimiento interno del hogar.
- `core/platform/`: Event Bus, Smart Input y preparacion de automatizaciones.
- `core/product/`: Product Intelligence System para feedback, bugs, decisiones, roadmap y analitica Alpha.
- `lib/services/`: reglas de dominio y persistencia local.
- `lib/ingestion/`: pipeline central de ingreso de datos.
- `lib/intelligence/`: analisis local, predicciones, recomendaciones, alertas y score.
- `lib/contracts/`: interfaces para proveedores futuros.
- `types/`: contratos de dominio compartidos.

## Release Alpha

Release Alpha agrega Home Intelligence Foundation sin servicios externos. La nueva capa toma datos locales de inventario, compras, consumo, ajustes e integrantes, y devuelve `HouseholdIntelligenceSummary`.

El flujo principal es:

```text
localStorage data -> HomeIntelligenceEngine -> hook -> Overview / Consumption / Assistant
```

La UI no calcula inteligencia directamente; consume el hook `useHomeIntelligence`.

## BETA 1 - Household Intelligence

BETA 1 agrega `core/knowledge/` como base del conocimiento interno:

- `KnowledgeGraph`: relaciones entre productos, categorias, tiendas, frecuencia, consumo, integrantes, prioridad, stock y predicciones.
- `HouseholdTimeline`: eventos temporales derivados de compras, inventario, presupuesto e inteligencia.
- `PatternMemory`: memoria persistente de patrones detectados.
- `ConfidenceEngine`: confianza local 0-100.
- `ExplanationEngine`: razones trazables para recomendaciones y predicciones.
- `KnowledgeRepository`: repositorio unico para leer, guardar, actualizar y refrescar conocimiento.

`HomeIntelligenceEngine` consume esta capa y expone conocimiento a Overview, Consumo y Asistente.

## BETA 2 - Platform Core

BETA 2 agrega `core/platform/` como nucleo transversal:

- `events/`: Event Bus tipado, logger, store y dispatcher.
- `input/`: Smart Input Framework con adaptadores manual, texto, OCR, barcode, voz, Excel y API.
- `automation/`: contratos para reglas futuras basadas en eventos.

El flujo de compra manual queda:

```text
Purchase UI -> SmartInputFramework -> DataIngestionEngine -> PurchaseService / InventoryUpdater -> EventBus
```

Los modulos publican eventos, pero todavia no reaccionan automaticamente.

## Release 2.1 - Natural Language Input

La entrada en lenguaje natural vive sobre Platform Core:

- `TextParser` extrae entidades desde texto libre.
- `EntityResolver` normaliza productos y cruza contra inventario.
- `TextInputAdapter` convierte texto en `RawPurchaseInput`.
- `QuickPurchaseCard` muestra previsualizacion antes de confirmar.

Al confirmar, la compra entra por `SmartInputFramework` y luego `DataIngestionEngine`, manteniendo el flujo unico de compras.

## Alpha 1.1 - Product Intelligence

Alpha 1.1 agrega `core/product/` como capa local de aprendizaje de producto:

- `FeedbackEngine` captura y consulta feedback.
- `BugEngine` registra errores reportados.
- `FeatureRequestEngine` organiza ideas.
- `ProductDecisionEngine` deja trazabilidad de decisiones.
- `RoadmapEngine` sugiere prioridades por recurrencia y severidad.
- `AnalyticsEngine` resume KPIs de Alpha Cerrada y lee senales del Event Bus.

El flujo principal es:

```text
Settings Feedback -> core/product -> localStorage -> Product Dashboard -> JSON/CSV export
```

La vista administrativa se expone en `/dashboard?view=product`.

## Alpha 1.3 - First Run Experience

Alpha 1.3 agrega `lib/services/first-run-service.ts` como coordinador local del primer uso.

Responsabilidades:

- Detectar si existe una configuracion valida de hogar en `localStorage`.
- Marcar inicio y finalizacion del onboarding.
- Guardar modo demo o modo hogar vacio.
- Cargar datos demo desde `mock-home` cuando el usuario lo solicita.
- Guardar arrays vacios de inventario y compras cuando el usuario empieza desde cero.
- Persistir checklist de bienvenida del dashboard.
- Registrar eventos de Product Analytics.

El flujo principal es:

```text
Landing/Login/Dashboard gate -> first-run-service -> Onboarding -> localStorage -> Dashboard
```

`DashboardShell` contiene la proteccion cliente para no renderizar el dashboard operativo si no hay hogar. La ruta `/onboarding` no implementa autenticacion; solo crea la configuracion local requerida para empezar.

## PWA

La PWA usa `public/manifest.webmanifest`, metadata en `app/layout.tsx`, safe areas en CSS global y navegacion inferior mobile en `DashboardShell`.

## Mobile-first

El dashboard conserva sidebar en desktop y usa bottom navigation en mobile. Formularios largos usan scroll interno y tap targets minimos de 44px.

## Futuro nativo

Los servicios de dominio estan diseñados para poder reutilizarse en una app Expo. La UI web deberia reimplementarse con componentes nativos, pero ingestion, normalizacion, consumo y reglas locales pueden mantenerse.
