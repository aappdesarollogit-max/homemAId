# Product Intelligence System

Release: Alpha 1.1

## Objetivo

Product Intelligence System centraliza la captura, clasificacion, priorizacion y revision del feedback de Alpha Cerrada sin conectar OpenAI ni Supabase.

## Arquitectura

```text
Settings Feedback Form
  -> FeedbackEngine
  -> ProductStorage local
  -> Product Dashboard
  -> RoadmapEngine / AnalyticsEngine
  -> JSON / CSV export
```

## Modulos

- `FeedbackEngine`: CRUD, filtros, busqueda y exportacion.
- `BugEngine`: registro de bugs, stack, pantalla, accion y prioridad.
- `FeatureRequestEngine`: registro de ideas y solicitudes de producto.
- `ProductDecisionEngine`: decisiones trazables sobre feedback.
- `RoadmapEngine`: priorizacion automatica por recurrencia y severidad.
- `AnalyticsEngine`: KPIs de feedback, parser, compras y uso del asistente.

## Almacenamiento

Alpha 1.1 usa `localStorage` con la key `homemaid.product.intelligence`. El formato se mantiene como snapshot unico para facilitar migracion posterior a Supabase.

## Dashboard

La vista administrativa vive en:

```text
/dashboard?view=product
```

Muestra KPIs, feedback reciente, bugs, ideas, prioridades, roadmap sugerido y exportacion JSON/CSV.

## Fuentes futuras

El sistema queda preparado para recibir feedback desde:

- formulario manual
- captura automatica de errores
- eventos del Event Bus
- conversaciones con asistente
- reportes remotos cuando exista Supabase

