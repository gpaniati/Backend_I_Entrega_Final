//Agrega el producto seleccionado al carrito elegido.
const agregarAlCarrito = ( pid ) => {
    const carts = document.querySelector('#select-carritos');
    const cid = carts.options[carts.selectedIndex].value;

    fetch(`/api/carts/${ cid }/products/${ pid }`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
};