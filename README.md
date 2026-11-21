# Delivery Rápido

Demo de catálogo gastronómico y armado de pedidos. Construida con HTML, CSS y JavaScript, sin dependencias de runtime ni servicios externos.

## Funcionalidades

- Buscador de restaurantes por nombre o especialidad, con estado sin resultados.
- Visualización del menú de cada restaurante.
- Carrito con agrupación de productos repetidos, cantidades, eliminación, subtotal y límite de 99 unidades por producto.
- Persistencia de la selección en el navegador mediante `localStorage`. Al recuperar el carrito, los precios se leen del catálogo de la aplicación, no de los datos almacenados.
- Confirmación de pedido **simulada**: no se piden datos bancarios, no se registran pedidos y no se realizan pagos.
- Navegación por teclado, etiquetas accesibles y diseño adaptable a pantallas pequeñas.

## Ejecutar

Abrí `index.html` en un navegador moderno. Para levantar un servidor local:

```bash
python -m http.server 8000
```

Después abrí `http://localhost:8000`.

## Pruebas

Necesitás Node.js (sin instalar paquetes de npm):

```bash
node --check cart.js
node --check script.js
node --test tests/*.test.cjs
```

El workflow de GitHub Actions ejecuta los mismos controles en cada pull request y push a `main`.

## Estructura

- `index.html`: semántica y regiones de la interfaz.
- `style.css`: estilos responsive y estados de interacción.
- `script.js`: catálogo, eventos y renderizado.
- `cart.js`: operaciones del carrito sin dependencias del DOM, reutilizables en pruebas.
- `tests/cart.test.cjs`: pruebas del carrito, validaciones, totales y restauración de datos.

## Alcance

Es una demostración con restaurantes y precios ficticios, sin backend. El carrito persiste solo en el navegador local; no hay autenticación, envío, impuestos, inventario ni integración de cobros. Una implementación comercial requiere especificar los flujos de pedidos, disponibilidad, seguridad, pagos y persistencia del servidor.
