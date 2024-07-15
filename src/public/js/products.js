//Agrega el producto seleccionado al carrito elegido.
const agregarAlCarrito = ( pid ) => {
    const carts = document.querySelector('#select-carritos');
    const cid = carts.options[carts.selectedIndex].value;

    try{
        fetch(`/api/carts/${ cid }/products/${ pid }`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
          },
        })

        Swal.fire({
            icon: "success",
            title: "Producto agregado con exito!!!",
          });
    }catch(error){
        throw new Error(error.message);
    }
};