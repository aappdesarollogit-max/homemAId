# Bug Triage

## Objetivo

Definir una forma simple de revisar bugs reportados durante Alpha Cerrada.

## Registro

`BugEngine` permite registrar:

- error
- stack
- pantalla
- accion
- usuario
- fecha
- prioridad
- estado

## Priorizacion

- Critica: bloquea flujo principal o genera perdida de datos.
- Alta: afecta una funcionalidad importante, con workaround limitado.
- Media: afecta experiencia o consistencia, pero no bloquea.
- Baja: detalle visual, copy o comportamiento menor.

## Decision

Cada bug puede cerrarse con `ProductDecisionEngine`:

- Corregir bug
- Mover al backlog
- Duplicado
- Ya resuelto
- No hacer nada

Toda decision debe registrar motivo.

