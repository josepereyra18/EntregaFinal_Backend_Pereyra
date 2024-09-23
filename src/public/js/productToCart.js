const socket = io();

const agregarAlCarritoBtn = document.getElementsByClassName('btn btn-sm btn-outline-secondary AgregarAlCarrito');
const item_count_btn = document.getElementById('cartItem');
const cartContainer = document.getElementById('cart');
const pagoContainer = document.getElementById('pago-container');
let carritoId
let itemCount = 0;

  for (let btn of agregarAlCarritoBtn) {
    btn.addEventListener('click', async (e) => {
      if (!carritoId) {
        carritoId = 0
        itemCount++
        item_count_btn.innerHTML = parseInt(itemCount)
        productId = e.target.getAttribute('data-product-id');
        socket.emit('agregarProducto', productId, carritoId);
        console.log(`${productId} agregado al carrito`);
      }else{
        itemCount++
        productId = e.target.getAttribute('data-product-id');
        socket.emit('agregarProducto', productId, carritoId);
        item_count_btn.innerHTML = parseInt(itemCount)
        console.log(`${productId} agregado al carrito`);
      }
    });
  }

socket.on('productoAgregado', (data) => {
    Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: `Producto ${data.title} agregado al carrito :D`,
        showConfirmButton: false,
        timer: 3000
    });
    cartContainer.innerHTML += `
      <div class="card" style=" width: 23rem; background-color: rgb(41, 46, 51);">
        <div class="card-body" style="width: 23rem;  display: flex; align-items: center; justify-content: space-between;">
          <h5 class="card-title">${data.title}</h5>
          <p class="card-text">${data.price}</p>
          <p class="card-text">$ ${data.quantity}</p>
        </div>
      </div> 
    `
})

socket.on('cartId', (data) => {
    Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'info',
        title: `bienvenid@! Inicio de sesion exitosa`,
        showConfirmButton: false,
        timer: 3000
    });
    carritoId = data;
})


socket.on('reestablecerCart', (data) => {
  for(let i = 0; i < data.length; i++){
    cartContainer.innerHTML += `
      <div class="card" style=" width: 23rem; background-color: rgb(41, 46, 51);">
        <div class="card-body" style="width: 23rem;  display: flex; align-items: center; justify-content: space-between;">
          <h5 class="card-title">${data[i].title}</h5>
          <p class="card-text">${data[i].price}</p>
          <p class="card-text">$ ${data[i].quantity}</p>
        </div>
      </div> 
    `
  }
})


socket.on('cartNoUser', (data) => {
  if (data.length === 0) {
    pagoContainer.innerHTML = `
      <h5 class="text-center offCanvasStyle">No hay productos en el carrito</h5>
    `
  }else{
    pagoContainer.innerHTML = `
    <a href="/purchase" class="btn btn-primary" id="purchaseButton"> Pagar </a>
    `
  }
})