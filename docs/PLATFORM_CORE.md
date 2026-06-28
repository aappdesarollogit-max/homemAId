# Platform Core

## Objetivo

BETA 2 crea el núcleo de plataforma de homemAId para soportar entradas inteligentes, eventos internos y futuras automatizaciones sin acoplar módulos.

## Capas

- `core/platform/events/`: Event Bus local tipado.
- `core/platform/input/`: Smart Input Framework y adaptadores.
- `core/platform/automation/`: preparación para Automation Engine.

## Integración Actual

- Nueva compra manual pasa por Smart Input Framework y luego Data Ingestion Engine.
- Compras publican `purchase.created` y `purchase.deleted`.
- Inventario publica eventos de creación, edición, eliminación y apertura.
- Ajustes publica `settings.updated`.
- Asistente publica `assistant.message.sent`.
- Inteligencia publica `intelligence.refreshed`.
- Inputs publican `input.received`, `input.normalized` o `input.failed`.

## Principio

Platform Core no agrega pantallas, CRUD, OpenAI, Supabase, OCR, voz ni código de barras real. Solo establece contratos y flujo interno.
