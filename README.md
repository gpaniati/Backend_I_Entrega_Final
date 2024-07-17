# Programación Backend 04-2024
*Curso de Programación Backend - Coder House*

**Requerimientos:**
- Node.js v18.18.2
- GIT v2.34.1
- IDE - Visual Studio Code v1.89.1

**Definiciones**
- En la carpeta demo del proyecto se encuentra las demos para consultar por filtros/ordenamiento/Paginacion, añadir un producto (POST) y modificarlo (PUT) desde la api expuesta
  http://localhost:8080/api/products

- Tambien se puede paginar, ordenar y filtrar desde la vista index.handlebars. Los filtros son por categoria.
  Ejemplos:
  * http://localhost:8080/products?category=bebidas
  * http://localhost:8080/products?category=desayuno
  * http://localhost:8080/products?category=mermeladas

**Carts con populate**
API
- http://localhost:8080/api/carts/:cid
APP - Vista de los productos del carritos
- http://localhost:8080/carts/:cid

**Socket**
  * http://localhost:8080/realtimeproducts
  - Desde esta ruta se puede paginar, borrar productos. Ademas yendo al detalle de cada producto, se puede agregar al carrito elegido
    desde el combo de carritos(al detalle de producto se va de manera estatica desde http://localhost:8080/products - NO ESTA en el real ). La eliminacion de productos delde el realtimeproducts es notificada a otros clientes por sockets.

**Alumno Gaston Paniati**
- Entrega final
