import { Server } from "socket.io";
import ProductsManager from "../managers/ProductsManager.js";
import url from "url";
const productsManager = new ProductsManager();

const config = (serverHTTP) => {
    const serverSocket = new Server(serverHTTP);

    serverSocket.on("connection", async (socket) => {
        const queryParams = url.parse(socket.handshake.headers.referer, true).query;

        //Obtiene los productos de la base de productos y emite mensaje para renderizar productos del lado del cliente.
        const productos = await productsManager.getAll(queryParams);
        socket.emit("cliente-conectado", productos);


        //Elimina producto de la base y emite un mensaje a todos los usuarios conectados.
        socket.on("eliminar-producto", async ( id ) => {
            try {
                const queryParams = url.parse(socket.handshake.headers.referer, true).query;
                await productsManager.deleteOneById(id);

                const productosActualizados = await productsManager.getAll(queryParams);

                //Emite mensaje para renderizar productos frente a la eliminacion de uno.
                serverSocket.emit("renderizar-base", productosActualizados);

                //Emite notificación al usuario que eliminó un producto.
                socket.emit("producto-eliminado-autor");
                //Emite notificación al resto de los usuarios conectados que se eliminó un producto.
                socket.broadcast.emit("producto-eliminado-resto", id);

            }catch (error){
                socket.emit("error", "Error al eliminar producto", error);
            }
        });


        //Inserta producto en la de la base y emite un mensaje a todos los usuarios conectados.
        socket.on("crear-producto", async ( producto ) => {
            try {
                const queryParams = url.parse(socket.handshake.headers.referer, true).query;

                //Toma esta imagen por default. No viene en el formulario.
                const thumbnails = "../public/images/modofit_producto_sin_imagen.png";

                console.log(producto);
                await productsManager.insertOne(producto, thumbnails);

                //Emite mensaje para renderizar productos frente a la creacion uno nuevo.
                const productosActualizados = await productsManager.getAll(queryParams);

                serverSocket.emit("renderizar-base", productosActualizados);
                //Emite notificación al usuario que creó el producto correctamente.
                socket.emit("producto-creado-autor");
            }catch (error){
                socket.emit("error", "Error al crear", error);
            }
        });
    });
};

export default {
    config,
};