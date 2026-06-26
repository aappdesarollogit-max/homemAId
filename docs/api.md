# HomeMaid API Mock

Endpoints internos disponibles mientras el dashboard sigue usando datos mock.

## Inventario

### `GET /api/inventory`

Devuelve productos del inventario.

Query params opcionales:

- `status`: `ok`, `low`, `critical`
- `category`: nombre de categoría, por ejemplo `Lácteos`, `Despensa`, `Limpieza`

### `GET /api/inventory/[id]`

Devuelve un producto por `id`.

Si no existe, responde `404` con:

```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "No encontramos ese producto en el inventario."
  }
}
```

## Compras

### `GET /api/purchases`

Devuelve compras recientes y metadata de gasto total.

### `GET /api/purchases/[id]`

Devuelve una compra por `id`.

Si no existe, responde `404` con:

```json
{
  "error": {
    "code": "PURCHASE_NOT_FOUND",
    "message": "No encontramos esa compra."
  }
}
```
