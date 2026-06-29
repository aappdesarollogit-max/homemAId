# Alpha Privacy Notice

Release: Closed Alpha 0.1.0-alpha.1

homemAId esta en una Alpha cerrada de prueba. Esta version existe para validar flujos basicos con 2-3 testers reales antes de conectar servicios externos.

## Datos que se guardan hoy

La app puede guardar en el navegador:

- Inventario, productos, stock, categorias y fechas de apertura.
- Compras registradas manualmente o con Smart Input de texto.
- Preferencias del hogar, presupuesto, integrantes y tiendas favoritas.
- Historial local del Asistente.
- Feedback, bugs, ideas, eventos de uso y datos de Product Intelligence.
- Memoria local de patrones, alertas, recomendaciones y explicaciones generadas por la app.

## Donde se guardan

Actualmente los datos se guardan en almacenamiento local del navegador (`localStorage`) en el dispositivo usado por el tester.

No existe sincronizacion entre dispositivos en esta Alpha.

## APIs externas

En esta Alpha no se conectan APIs externas para guardar o procesar datos.

No hay conexion con OpenAI.

No hay conexion con Supabase.

No hay OCR real ni procesamiento externo de imagenes.

## Riesgo de perdida de datos

Si el usuario borra datos del navegador, usa limpieza automatica, cambia de navegador, usa otro dispositivo o navega en un modo que limita almacenamiento local, puede perder la informacion guardada.

## Uso esperado

La Alpha es solo para prueba controlada. No debe usarse como registro definitivo de compras, inventario o presupuesto del hogar.
