# Pattern Memory

## Objetivo

Pattern Memory conserva patrones detectados en el tiempo para que homemAId pueda aprender hábitos del hogar sin una IA externa.

## Ubicación

- `core/knowledge/PatternMemory.ts`
- `core/knowledge/KnowledgeRepository.ts`

## Qué Guarda

Cada patrón conserva:

- título
- descripción
- confianza
- primera detección
- última detección
- ocurrencias
- productos relacionados

## Ejemplos

- compra leche cada cierto número de días
- gasto concentrado en limpieza
- tienda principal recurrente
- productos críticos repetidos
- productos nuevos frecuentes

## Persistencia

La memoria se guarda mediante `KnowledgeRepository`. Ningún otro módulo de `core/knowledge` accede directo a localStorage.

## Evolución

En Beta se puede agregar historial visual, resolución de patrones y aprendizaje más fino por día de semana.
