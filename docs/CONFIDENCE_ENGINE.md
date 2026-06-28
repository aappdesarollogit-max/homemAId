# Confidence Engine

## Objetivo

Confidence Engine asigna confianza de 0 a 100 a productos, predicciones y señales del hogar.

## Ubicación

- `core/knowledge/ConfidenceEngine.ts`

## Algoritmo Actual

La confianza sube cuando existe:

- más historial de compras
- estado de stock crítico o agotado
- pocos días estimados para agotamiento
- predicciones previas con buena base

La confianza baja cuando:

- no hay historial suficiente
- no existe relación clara entre compra e inventario
- la predicción no tiene fecha estimada

## Ejemplo

```text
Leche
Confianza: 97
Motivo: varias compras históricas y stock crítico.
```

## Principio

El motor no inventa certeza. Cuando hay poca información, devuelve confianza conservadora.
