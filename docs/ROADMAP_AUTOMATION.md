# Roadmap Automation

## Objetivo

Generar una lista sugerida de prioridades a partir de feedback real de Alpha Cerrada.

## Senales usadas

- cantidad de feedback relacionado
- prioridad declarada
- tipo de feedback
- pantalla afectada
- feature requests explicitos

## Ejemplos

```text
5 usuarios piden OCR
-> OCR sube prioridad
```

```text
3 usuarios no entienden Compras
-> Mejorar UX de Compras sube al roadmap
```

## Estado actual

Alpha 1.1 implementa una automatizacion local basada en reglas en `RoadmapEngine`. No usa IA externa.

## Evolucion futura

- consolidar duplicados con NLP local o IA externa
- asignar owner por area
- sincronizar con Supabase
- exportar a herramientas de roadmap
- detectar tendencias semanales

