# Alpha Test Cases

Release: Alpha 2.0 Hardening

## Onboarding

- Usuario nuevo sin datos ve CTA para crear hogar.
- Dashboard queda bloqueado si no existe onboarding completo.
- Inputs numericos no conservan ceros iniciales.
- Opciones demo/vacio tienen tap target comodo.
- Botones inferiores quedan visibles con teclado mobile.

## Checklist inicial

- Agregar primer producto abre Inventario en modo crear.
- El paso de producto se completa solo con `inventory.product.created`.
- Registrar primera compra abre Compras en modo nueva.
- El paso de compra se completa solo con `purchase.created`.
- Probar compra rapida enfoca/destaca la tarjeta de texto.
- El paso de compra rapida se completa solo con `text.input.confirmed`.
- Enviar primer feedback abre Ajustes > Feedback.
- El paso de feedback se completa solo con `feedback.created`.

## Parser V2

- `$25000` detecta monto 25000.
- `25000` detecta monto 25000.
- `25.000` detecta monto 25000.
- `25000 pesos` detecta monto 25000.
- `25 mil` detecta monto 25000.
- `25 lucas` detecta monto 25000.
- `dos leches` detecta 2 unidades de Leche.
- `2 leches` detecta 2 unidades de Leche.
- `una bebida` detecta 1 unidad de Bebida.
- `unos huevos` detecta 1 unidad de Huevo.
- Santa Isabel, Lider, Lider con tilde, Jumbo, Tottus, Unimarc, Mayorista, Acuenta y Central Mayorista se normalizan como tienda.

## Compras

- Compra manual sigue creando compra e inventario.
- Compra rapida con texto crea compra al confirmar.
- Parser fallido no crea compra.

## Product Dashboard

- Quality Dashboard muestra Parser Success, Parser Fail, Onboarding Completion, Feedback enviados y Errores criticos.

## Mobile

- Chrome iPhone 12 permite completar onboarding sin scroll bloqueado.
- Bottom nav no aparece durante onboarding incompleto.
- Formularios largos mantienen botones visibles.
