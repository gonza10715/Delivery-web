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

También hay pruebas de extremo a extremo con **Playwright y Chromium**, que ejecutan la aplicación por HTTP en un servidor local. Cubren búsqueda y estado sin resultados, agregado y cambio de cantidad del carrito, persistencia tras recargar, confirmación simulada, ausencia de errores JavaScript y desbordamiento horizontal, en dos tamaños: **1365 × 900 (PC)** y **390 × 844 (celular)**.

Para ejecutarlas localmente (Python 3):

```bash
python -m pip install playwright==1.57.0
python -m playwright install chromium
python tests/browser_smoke.py
```

En Linux con dependencias del sistema faltantes, seguí las instrucciones oficiales de Playwright para instalarlas. Estas pruebas usan un servidor HTTP temporal y datos ficticios; no hacen pedidos ni cobran dinero.

El workflow [Delivery Web checks](.github/workflows/checks.yml) ejecuta tanto las pruebas de Node.js como las de Chromium en cada pull request y push a `main`. Podés consultar [los resultados en GitHub Actions](https://github.com/gonza10715/Delivery-web/actions). Las pruebas automatizadas son una comprobación útil, pero no sustituyen una revisión completa de accesibilidad o de seguridad.

## Estructura

- `index.html`: semántica y regiones de la interfaz.
- `style.css`: estilos responsive y estados de interacción.
- `script.js`: catálogo, eventos y renderizado.
- `cart.js`: operaciones del carrito sin dependencias del DOM, reutilizables en pruebas.
- `tests/cart.test.cjs`: pruebas del carrito, validaciones, totales y restauración de datos.
- `tests/browser_smoke.py`: pruebas funcionales de la interfaz en Chromium para escritorio y celular.

## Alcance

Es una demostración con restaurantes y precios ficticios, sin backend. El carrito persiste solo en el navegador local; no hay autenticación, envío, impuestos, inventario ni integración de cobros. Una implementación comercial requiere especificar los flujos de pedidos, disponibilidad, seguridad, pagos y persistencia del servidor.
