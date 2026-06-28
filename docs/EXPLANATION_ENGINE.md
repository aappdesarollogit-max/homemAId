# Explanation Engine

## Objetivo

Explanation Engine genera explicaciones locales para recomendaciones, predicciones y patrones. No usa OpenAI.

## Ubicación

- `core/knowledge/ExplanationEngine.ts`

## Qué Explica

Cada explicación incluye:

- resumen
- razones
- confianza
- origen

## Ejemplo

```text
Compra leche.
Confianza: 94%.
Razones:
- quedan pocas unidades
- el producto está en estado crítico
- existe historial de compra
- frecuencia aproximada detectada
Origen: Household Knowledge Platform
```

## Integración

`HomeIntelligenceEngine` agrega confianza, explicación y origen a las recomendaciones. El asistente usa esos campos para responder con más transparencia.

## Evolución

OpenAI podrá transformar estas explicaciones en lenguaje más natural, pero no debe reemplazar la trazabilidad local.
