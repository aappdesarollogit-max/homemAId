# Quality Score

Release: Alpha 2.0 Hardening

## Objetivo

Medir si homemAId esta listo para una Alpha controlada con baja friccion.

## Metricas objetivo

| Metrica | Objetivo Alpha 2.0 |
| --- | --- |
| Parser Success | 80% o mas de entradas de texto reales con productos detectados |
| Parser Fail | Menos de 20% de intentos de compra rapida |
| Onboarding Completion | 90% o mas de usuarios que inician onboarding |
| Feedback enviados | Al menos 1 por tester durante 7 dias |
| Errores criticos | 0 abiertos antes de compartir nueva URL |

## Fuente

- Eventos de Platform Core: `input.*`, `text.input.*`, `purchase.created`, `inventory.product.created`, `feedback.created`.
- Product Intelligence local: feedback, bugs y analytics.

## Uso

Revisar `/dashboard?view=product` antes de cada deploy de Alpha.
