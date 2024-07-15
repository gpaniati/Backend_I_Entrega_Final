//Agrega el producto al carrito seleccionado.
const agregarAlCarrito = ( pid ) => {
    fetch(`/api/carts/6693166242a6c0ece02f636d/products/${ pid }`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",

        }, 
    })
};