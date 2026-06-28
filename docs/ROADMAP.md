# Roadmap

## Actual

- MVP web con dashboard funcional.
- Inventario, compras, consumo, asistente local y ajustes usando localStorage.
- Data Ingestion Engine preparado para fuentes futuras.
- Home Intelligence Engine local con score, recomendaciones, predicciones y alertas.
- Household Knowledge Platform con grafo, timeline, memoria de patrones, confianza y explicaciones.
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
