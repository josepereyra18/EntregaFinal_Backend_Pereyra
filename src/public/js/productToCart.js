

const socket = io();

const agregarAlCarritoBtn = document.getElementsByClassName('btn btn-sm btn-outline-secondary AgregarAlCarrito');
const item_count_btn = document.getElementById('cartItem');
const cartContainer = document.getElementById('cart');
const pagoContainer = document.getElementById('pago-container');
let carritoId = 0;  
let itemCount = 0;


for (let btn of agregarAlCarritoBtn) {
    btn.addEventListener('click', async (e) => {
        itemCount++;
        item_count_btn.innerHTML = itemCount;

        const productId = e.target.getAttribute('data-product-id');

        
        socket.emit('agregarProducto', productId, carritoId);
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
    socket.emit('reestablecerCart' ,data);
});

socket.on('cartId', (data) => {
    Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'info',
        title: '¡Inicio de sesión exitoso!',
        showConfirmButton: false,
        timer: 3000
    });

    carritoId = data;
});

socket.on('reestablecerCart', (data) => {
    itemCount= data.length;
    item_count_btn.innerHTML = itemCount;
    let totalPrice = data.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);

    data.forEach(product => {
        cartContainer.innerHTML += `
          <div class="card" style="width: 23rem; background-color: rgb(41, 46, 51);">
            <div class="card-body" style="display: flex; align-items: center; justify-content: space-between;">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-text">$${product.price}</p>
              <p class="card-text"> Cantidad: ${product.quantity}</p>
            </div>
          </div>
        `;
    });
    cartContainer.innerHTML += `
    <div class="card" style="width: 23rem; background-color: rgb(41, 46, 51);">
      <div class="card-body" style="display: flex; align-items: center; justify-content: space-between;">
        <h5 class="card-title">Total</h5>
        <p class="card-text">$${totalPrice.toFixed(2)}</p>
      </div>
    </div>
  `;
});

socket.on('cartNoUser', (data) => {
    if (data.length === 0) {
        pagoContainer.innerHTML = `
          <h5 class="text-center offCanvasStyle">No hay productos en el carrito</h5>
        `;
    } else {
        pagoContainer.innerHTML = `
          <a href="/purchase" class="btn btn-primary" id="purchaseButton">Pagar</a>
        `;
    }
});
