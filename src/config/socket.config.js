import { Server } from "socket.io";
import ProductManager from "../managers/productsManager.js";

const baseProducts = new ProductManager();

const config = (serverHTTP) => {
    const serverSocket = new Server(serverHTTP);

    serverSocket.on("connection", async (socket) => {
        //console.log("Cliente conectado");

        //Obtiene los productos de la base de productos y emite mensaje para renderizar productos del lado del cliente.
        const productos = await baseProducts.consultarProductos()
        socket.emit("cliente-conectado", productos);


        //Elimina producto de la base y emite un mensaje a todos los usuarios conectados.
        socket.on("eliminar-producto", async ( id ) => {
            try {
                await baseProducts.eliminarProducto(id);
                const productosActualizados = await baseProducts.consultarProductos();

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
                //Agrega producto nuevo y lo persiste.
                const { title, description, code, price, status, stock, category, thumbnails } = producto;
                await baseProducts.agregarProducto(title, description, code, Number(price), Boolean(status), Number(stock), category, thumbnails);

                //Emite mensaje para renderizar productos frente a la creacion uno nuevo.
                const productosActualizados = await baseProducts.consultarProductos();
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