# Roadmap

## Actual

- MVP web con dashboard funcional.
- Inventario, compras, consumo, asistente local y ajustes usando localStorage.
- Data Ingestion Engine preparado para fuentes futuras.
- Home Intelligence Engine local con score, recomendaciones, predicciones y alertas.
- Household Knowledge Platform con grafo, timeline, memoria de patrones, confianza y explicaciones.
- Platform Core con Event Bus, Smart Input y Automation Engine preparado.
- Natural Language Input para compra rapida con previsualizacion.
- PWA ready y experiencia mobile-first.

## Release Alpha

- Integrar inteligencia local en Overview, Consumo y Asistente.
- Mantener OpenAI, Supabase, OCR y codigo de barras fuera del alcance.
- Corregir UX critica mobile para formularios en bottom sheet.
- Documentar arquitectura de inteligencia y evolucion futura.

## BETA 1 - Household Intelligence

- Crear `core/knowledge/` como base del conocimiento interno.
- Persistir knowledge graph, timeline y pattern memory localmente.
- Agregar confianza y explicaciones a recomendaciones.
- Exponer insights del hogar en Overview.
- Exponer predicciones, confianza y explicaciones en Consumo.
- Mantener OpenAI, Supabase, OCR, codigo de barras y Data Ingestion fuera del alcance funcional.

## BETA 2 - Platform Core

- Crear Event Bus local tipado.
- Publicar eventos de compras, inventario, ajustes, asistente, inteligencia e input.
- Crear Smart Input Framework y adaptadores futuros.
- Enrutar compra manual por Smart Input y Data Ingestion.
- Preparar Automation Engine sin ejecutar automatizaciones reales.
- Documentar evolucion hacia OCR, OpenAI, Supabase y automatizaciones.

## Release 2.1 - Natural Language Input

- Crear parser local por reglas.
- Resolver entidades contra inventario.
- Agregar Compra rapida en Compras.
- Confirmar compra por Smart Input y Data Ingestion.
- Reutilizar parser desde el Asistente.
- Registrar eventos `text.input.*`.

## Sprint 10 sugerido

- Hardening visual mobile con pruebas en dispositivos reales.
- Preparar prompt de instalacion PWA.
- Definir flujo de captura para camara/OCR.
- Agregar capa de export/import de datos demo.
- Empezar estrategia de persistencia remota.

## Futuro

- OCRProvider real.
- AIProvider real.
- BarcodeProvider real.
- Sincronizacion multi-dispositivo.
- Migracion progresiva a Expo si la experiencia PWA valida uso frecuente.
