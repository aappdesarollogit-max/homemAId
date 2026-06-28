# Home Intelligence Engine

## Objetivo

Home Intelligence Engine convierte datos locales de homemAId en señales útiles para el hogar: score, riesgos, patrones, predicciones, recomendaciones y alertas. Funciona sin OpenAI, Supabase, OCR ni APIs externas.

## Arquitectura

La capa vive en `lib/intelligence/`:

- `HomeIntelligenceEngine.ts`: orquesta el análisis completo.
- `PatternAnalyzer.ts`: detecta hábitos y concentraciones.
- `PredictionEngine.ts`: calcula predicciones simples.
- `RecommendationEngine.ts`: genera recomendaciones accionables.
- `AlertEngine.ts`: crea alertas locales.
- `IntelligenceScoring.ts`: calcula score y riesgo.
- `HouseholdMemory.ts`: persiste memoria local en localStorage.

El hook `hooks/useHomeIntelligence.ts` carga inventario, compras, consumo, ajustes e integrantes, ejecuta el motor y expone el resultado a la UI.

## Fuentes de datos

- Inventario local.
- Compras locales.
- Métricas de consumo.
- Ajustes del hogar.
- Integrantes.
- Memoria local de inteligencia.

## Pipeline

```text
load local data
  -> analyze patterns
  -> predict needs
  -> generate alerts
  -> calculate score
  -> generate recommendations
  -> persist memory
  -> return HouseholdIntelligenceSummary
```

## Score

El score del hogar va de 0 a 100. Considera productos críticos, presupuesto usado, alertas, diversidad de compras, frecuencia de datos, gasto mensual y completitud de ajustes.

Riesgos:

- `low`: hogar controlado.
- `medium`: hay señales a vigilar.
- `high`: conviene actuar pronto.
- `critical`: hay riesgo claro de presupuesto, stock o datos incompletos.

## Predicciones

Las predicciones actuales son locales y conservadoras:

- productos que podrían agotarse pronto
- días estimados para agotamiento
- próxima compra sugerida
- riesgo de superar presupuesto
- productos a reponer
- categorías con tendencia alta

Si no hay historial suficiente, el motor no inventa datos.

## Recomendaciones

Las recomendaciones tienen prioridad e impacto:

- prioridad: `low`, `medium`, `high`
- impacto: `ahorro`, `urgencia`, `organización`, `prevención`, `presupuesto`

Ejemplos:

- reponer productos críticos
- controlar compras no esenciales
- revisar gasto concentrado
- mantener categorías prioritarias al día

## Alertas

Alertas locales soportadas:

- producto agotado
- producto por agotarse
- presupuesto sobre umbral
- presupuesto sobre 100%
- compra inusual
- alta concentración de gasto
- sin compras recientes
- inventario sin datos

La memoria permite marcar alertas como resueltas sin requerir UI adicional todavía.

## Integración Con Asistente

El asistente local usa `intelligenceSummary` para responder preguntas como:

- ¿Qué va a pasar esta semana?
- ¿Qué productos se acabarán pronto?
- ¿Qué me recomiendas?
- ¿Cuál es el estado inteligente del hogar?
- ¿Qué riesgos tengo?
- ¿Qué patrones detectaste?
- ¿Cómo puedo ahorrar?
- ¿Qué debería revisar hoy?

## Evolución Con OpenAI

OpenAI podrá entrar después como capa explicativa o conversacional, pero no debe reemplazar el motor local. La arquitectura recomendada es:

1. Datos reales locales.
2. Home Intelligence Engine calcula señales determinísticas.
3. OpenAI interpreta, resume o conversa usando esas señales.
4. Cualquier compra generada por IA entra por Data Ingestion Engine.

Así se mantiene control, trazabilidad y seguridad.
