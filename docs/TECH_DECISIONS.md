# Technical Decisions

## Release Alpha

### Inteligencia local antes que IA externa

Home Intelligence Engine funciona con reglas deterministicas y datos locales. No conecta OpenAI ni APIs externas. Esto permite validar valor de producto, proteger datos del hogar y mantener costos en cero durante Alpha.

### Un orquestador central

`HomeIntelligenceEngine.ts` es el punto de entrada para calcular inteligencia. Pattern Analyzer, Prediction Engine, Alert Engine, Recommendation Engine y Scoring se mantienen como modulos separados para evitar componentes gigantes y facilitar pruebas.

### Memoria local encapsulada

`HouseholdMemory.ts` es el unico modulo nuevo de inteligencia que accede a localStorage. Las vistas y el asistente consumen el resumen calculado, no escriben memoria directamente.

### UI como consumidora

Overview y Consumption no calculan reglas de inteligencia. Usan `useHomeIntelligence`, lo que mantiene la UI desacoplada de dominio.

### IA futura subordinada a datos reales

Cuando se conecte OpenAI, debera usar `HouseholdIntelligenceSummary` como contexto y Data Ingestion Engine para cualquier compra creada desde conversacion. No debe saltarse validacion, normalizacion ni actualizacion de inventario.
