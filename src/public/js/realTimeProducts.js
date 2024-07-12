//Lado del cliente.
const socket = io();

//Devuelve la estructura html de una Card de Boostrap.
const crearCarta = (producto) => {
    return (`
            <div class="col-md-4 d-flex justify-content-around">
                <div class="card mb-4" style="width: 20rem">
                    <img src="${producto.thumbnails}" class="card-img-top" alt="${producto.code}">
                    <div class="card-body">
                        <h5 class="card-title">${producto.title}</h5>
                        <p class="card-text">${producto.description}</p>
                        <p class="card-text">Precio: $${producto.price}</p>
                        <button type="button" class="btn btn-danger"
                            onclick="eliminarProducto('${producto.id}')">Eliminar</button>
                    </div>
                </div>
    `);
}

//Renderiza los productos en el contenerdor de cartas del layout realTimeProducts.
const renderizarProductos = (productos) => {
    //Selecciono el contenedor de la carta del layout realTimeProducts
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = ``;
    productos.forEach( producto => {
        const cardHTML = crearCarta(producto);
        cardsContainer.innerHTML += cardHTML;
    });
 }

//Elimina un producto de la base de productos (ONCLICK del boton eliminar de cada producto).
const eliminarProducto = (id) => {
    socket.emit("eliminar-producto", id);
}

//Crea un nuevo producto en base a los datos ingredados en el formulario.
const crearProducto = () => {
    const entradasFormulario = document.getElementById('form-crearProducto');
    let i = 0;
    let faltanDatosEntrada = false;

    //Valida que se informen todos los datos de entrada.
    while ((i < entradasFormulario.length)&&(!faltanDatosEntrada)) {
        if (entradasFormulario[i].type !== "button"){
            if(entradasFormulario[i].value.trim() == ""){
                Swal.fire({
                    icon: "warning",
                    title: "Datos de entrada incompletos",
                    html: `Falta carga el campo <b>${entradasFormulario[i].id}</b>!`
                });
                faltanDatosEntrada = true;
            }
        }
        i++;
    }
    if (!faltanDatosEntrada) {
        //Defino nuevo producto.
        const nuevoProducto = {
        title: (document.getElementById("titulo")).value,
        description: (document.getElementById("descripcion")).value,
        code: (document.getElementById("codigo")).value,
        price: (document.getElementById("precio")).value,
        status: true,
        stock: (document.getElementById("stock")).value,
        category: (document.getElementById("categoria")).value,
        thumbnails: "https://i.ibb.co/BCP4y5H/modofit-producto-sin-imagen.png"
        };

        //Limpiar formulario.
        for (i = 0; i < entradasFormulario.length; i++){
            if (entradasFormulario[i].type == "text"){
                entradasFormulario[i].value = "";
            }
        }

        socket.emit("crear-producto", nuevoProducto);
    }
};

//Notificación de producto eliminado a todos los clientes conectados al servidor.
socket.on("producto-eliminado-resto", (id) => {
    Swal.fire({
        position: "top-end",
        icon: "warning",
        title: `Han eliminado el producto ${id} de la base`,
        showConfirmButton: false,
        timer: 1500
    });
});

//Notificación de producto eliminado al cliente que lo eliminó.
socket.on("producto-eliminado-autor", () => {
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Producto eliminado correctamente",
        showConfirmButton: false,
        timer: 1500
    });
});

//Notificación de producto credo al cliente que lo creó.
socket.on("producto-creado-autor", () => {
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Producto creado correctamente",
        showConfirmButton: false,
        timer: 1500
    });
});

//Renderiza los productos de la base cuando se conecta un cliente nuevo.
socket.on("cliente-conectado", (productos) => {
    renderizarProductos(productos);
});

//Renderiza los productos de la base frente a la accion de algun cliente sobre la misma (Eliminar producto/ Crear Producto).
socket.on("renderizar-base", (productos) => {
    renderizarProductos(productos);
});

//Error al realizar alguna accion.
socket.on("error", (descripcionError, error) => {
    Swal.fire({
        icon: "error",
        title: "Algo salio mal...",
        text: `descripcionError ${error}`
    });
});