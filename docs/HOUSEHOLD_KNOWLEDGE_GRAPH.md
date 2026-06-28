# Household Knowledge Graph

## Objetivo

El Knowledge Graph representa el conocimiento interno del hogar como nodos y relaciones. No usa librerías externas ni servicios remotos.

## Ubicación

- `core/knowledge/KnowledgeGraph.ts`
- `core/knowledge/KnowledgeRepository.ts`

## Modelo

Nodos principales:

- producto
- categoría
- supermercado
- frecuencia
- consumo
- integrantes
- prioridad
- stock
- predicción
- presupuesto

Relaciones principales:

- producto pertenece a categoría
- producto se compra en supermercado
- producto tiene frecuencia
- compra afecta consumo
- producto es usado por integrantes
- categoría tiene prioridad
- producto tiene stock
- producto tiene predicción
- consumo afecta presupuesto

## Uso Actual

`HomeIntelligenceEngine` refresca el grafo en cada análisis. Overview usa el número de nodos como señal liviana y el repositorio lo conserva en localStorage.

## Evolución

El grafo permitirá que OpenAI, OCR, código de barras o APIs futuras consulten el conocimiento existente sin inventar contexto.
