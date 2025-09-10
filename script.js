let carrito = [];

const productos = [
  {
    nombre: "Helado de Vainilla",
    imagen: "imagenes/vainilla.jpg",
    precioPorBola: 2500,
  },
  {
    nombre: "Helado de Chocolate",
    imagen: "imagenes/chocolate.jpg",
    precioPorBola: 2500,
  },
  {
    nombre: "Helado de Fresa",
    imagen: "imagenes/fresa.jpg",
    precioPorBola: 2500,
  },
];

// ✅ Carga productos al inicio
function cargarProductos() {
  const contenedor = document.getElementById("menu-digital");
  contenedor.innerHTML = "";

  productos.forEach((producto, index) => {
    contenedor.innerHTML += `
      <div class="producto">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <label for="cantidad-${index}">Cantidad:</label>
        <select id="cantidad-${index}">
          <option value="1">1 bola</option>
          <option value="2">2 bolas</option>
          <option value="3">3 bolas</option>
        </select>
        <p>Precio por bola: $${producto.precioPorBola.toLocaleString()}</p>
        <button onclick="pedirHelado('${producto.nombre}', 'cantidad-${index}')">Pedir</button>
      </div>
    `;
  });
}

function pedirHelado(nombre, selectId) {
  const select = document.getElementById(selectId);
  const cantidad = parseInt(select.value);

  if (!cantidad || cantidad <= 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Cantidad no válida',
      text: 'Por favor selecciona una cantidad mayor a 0.'
    });
    return;
  }

  const precioPorBola = 2500;
  const total = cantidad * precioPorBola;

  carrito.push({
    nombre: `${nombre} (${cantidad} bola${cantidad > 1 ? 's' : ''})`,
    precio: total
  });

  guardarCarrito();
  actualizarPedido();

  // ✅ Toast de éxito
  Toastify({
    text: `🧊 ${nombre} agregado (${cantidad} bola${cantidad > 1 ? 's' : ''})`,
    duration: 3000,
    gravity: "bottom",
    position: "right",
    style: {
      background: "#4CAF50",
      color: "#fff"
    }
  }).showToast();
}

function actualizarPedido() {
  const lista = document.getElementById('lista-pedido');
  const total = document.getElementById('total-pedido');
  const contador = document.getElementById('contador-carrito');
  
  lista.innerHTML = '';
  let suma = 0;

  carrito.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.nombre} - $${item.precio.toLocaleString()}
      <button class="eliminar" onclick="eliminarDelPedido(${index})">❌</button>
    `;
    li.classList.add('agregado'); // activa animación

    lista.appendChild(li);

    setTimeout(() => {
      li.classList.remove('agregado'); // quita clase para evitar conflicto luego
    }, 400); // duración animación CSS
    suma += item.precio;
  });

  contador.textContent = carrito.length;
  total.textContent = carrito.length > 0
    ? `Total: $${suma.toLocaleString()}`
    : 'No has agregado productos.';
}


function eliminarDelPedido(index) {
  const lista = document.getElementById('lista-pedido');
  const item = lista.children[index];

  // Agrega clase de salida
  item.classList.add('eliminado');

  // Espera la animación antes de eliminar
  setTimeout(() => {
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarPedido();

    // Toast
    Toastify({
      text: `🗑️ Producto eliminado`,
      duration: 2500,
      gravity: "bottom",
      position: "right",
      style: {
        background: "#FF6347"
      }
    }).showToast();

  }, 300); // tiempo igual al transition del CSS
}


function enviarPedido() {
  if (carrito.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'Carrito vacío',
      text: 'No has agregado ningún producto.'
    });
    return;
  }

  let mensaje = '*Pedido desde Heladeria antojitos*%0A';

  carrito.forEach(item => {
    mensaje += `- ${item.nombre}: $${item.precio.toLocaleString()}%0A`;
  });

  let total = carrito.reduce((sum, i) => sum + i.precio, 0);
  mensaje += `%0A*Total:* $${total.toLocaleString()}`;

  const numero = '573158819352';
  const url = `https://wa.me/${numero}?text=${mensaje}`;
  window.open(url, '_blank');

  Swal.fire({
    icon: 'success',
    title: '¡Pedido enviado!',
    text: 'Redirigiendo a WhatsApp...'
  });

  carrito = [];
  guardarCarrito();
  actualizarPedido();
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarrito() {
  const guardado = localStorage.getItem('carrito');
  if (guardado) {
    carrito = JSON.parse(guardado);
  }
}

// ✅ Modal
function mostrarModal() {
  document.getElementById('modal').classList.add('activo');
}

function cerrarModal() {
  document.getElementById('modal').classList.remove('activo');
}

// ✅ Inicia
window.onload = () => {
  cargarCarrito();
  cargarProductos();
  actualizarPedido();
};
function initMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const ubicacion = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          const mapa = new google.maps.Map(document.getElementById('mapa-usuario'), {
            zoom: 16,
            center: ubicacion
          });

          new google.maps.Marker({
            position: ubicacion,
            map: mapa,
            title: 'Estás aquí'
          });
        },
        function (error) {
          console.warn("Error de geolocalización:", error.message);
          alert("No se pudo obtener tu ubicación.");
        }
      );
    } else {
      alert("Tu navegador no admite geolocalización.");
    }
  }