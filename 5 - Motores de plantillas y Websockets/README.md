# **Motores de plantillas y Websockets**

## Consigna

Configurar nuestro proyecto para que trabaje con Handlebars y websocket.

## Aspectos a incluir

- Configurar el servidor para integrar el motor de plantillas Handlebars e instalar un servidor de socket.io al mismo.
- Crear una vista "home.handlebars" la cual contenga una lista de todos los productos agregados hasta el momento.
- Ademas, crear una vista "realTimeProducts.handlebars", la cual vivira en el endpoint "/realtimeproducts" en nuestro views router, esta contendra la misma lista de productos, sin embargo, esta trabajara con websockets.
Al trabajar con websockets, cada vez que creemos un producto nuevo, o bien cada vez que eliminemos un producto, se debe actualiar automaticamente en dicha vista la lista.

## Sugerencias

- Ya que la conexion entre una consulta HTTP y websocket no esta contemplada dentro de la clase. Se recomienda que, para la creacion y eliminacion de un producto, se cree un formulario simple en la vista realTimeProducts.handlebars. Para que el contenido se envie desde websockets y no HTTP. Sin embargo, esta no es la mejor solucion, leer el siguiente punto.
- Si se desea hacer la conexion de socket emits con HTTP, deberas buscar la forma de utilizar el servidor io de sockets dentro de la peticion POST. ¿Como utilizaras un emit dentro del POST?
