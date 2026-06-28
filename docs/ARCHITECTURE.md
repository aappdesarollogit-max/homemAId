# Architecture

## Capas

- `app/`: rutas Next.js y composicion de pantallas.
- `components/`: UI reutilizable.
- `hooks/`: estado cliente por modulo.
- `core/knowledge/`: plataforma de conocimiento interno del hogar.
- `core/platform/`: Event Bus, Smart Input y preparacion de automatizaciones.
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

## PWA

La PWA usa `public/manifest.webmanifest`, metadata en `app/layout.tsx`, safe areas en CSS global y navegacion inferior mobile en `DashboardShell`.

## Mobile-first

El dashboard conserva sidebar en desktop y usa bottom navigation en mobile. Formularios largos usan scroll interno y tap targets minimos de 44px.

## Futuro nativo

Los servicios de dominio estan diseñados para poder reutilizarse en una app Expo. La UI web deberia reimplementarse con componentes nativos, pero ingestion, normalizacion, consumo y reglas locales pueden mantenerse.
