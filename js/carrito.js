const STORAGE_CARRITO = "carrito";
const listaCarrito = document.getElementById("listaCarrito");

const subtotalEl = document.getElementById("subtotal");
const ivaEl = document.getElementById("iva");
const descuentoEl = document.getElementById("descuento");
const totalEl = document.getElementById("total");
const carritoVacio = document.getElementById("carritoVacio");
const alertaCarrito = document.getElementById("alertaCarrito");
const btnVaciarCarrito = document.getElementById("btnVaciarCarrito");
const btnConfirmarVaciar = document.getElementById("confirmarVaciar");
const btnConfirmarReserva = document.getElementById("btnConfirmarReserva");
function obtenerCarrito() {
  const datos = localStorage.getItem(STORAGE_CARRITO);

  return datos ? JSON.parse(datos) : [];
}
function guardarCarrito(carrito) {
  localStorage.setItem(STORAGE_CARRITO, JSON.stringify(carrito));
  window.actualizarContadorCarrito?.();
}
function formatearPrecio(precio) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(precio);
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarCarrito();
});

window.addEventListener("reservas-actualizadas", renderizarCarrito);

function crearItemCarrito(item) {
  const tarjeta = document.createElement("div");
  tarjeta.className = "carrito-item";
  tarjeta.innerHTML = `

        <img
            src="${item.imagen}"
            alt="${item.nombre}"
            class="carrito-img"
            onerror="this.src='../assets/images/hero.png'"
        >

        <div class="carrito-info">

            <span class="categoria">
                ${item.categoria}
            </span>

            <h4>${item.nombre}</h4>

            <p class="ubicacion">

                <i class="bi bi-geo-alt-fill"></i>

                ${item.region}

            </p>

            <p class="precio">

                ${formatearPrecio(item.precio)}

            </p>

        </div>

        <div class="carrito-cantidad">

            <button class="btn-cantidad disminuir">

                <i class="bi bi-dash"></i>

            </button>

            <span class="cantidad">

                ${item.cantidad}

            </span>

            <button class="btn-cantidad aumentar">

                <i class="bi bi-plus"></i>

            </button>
        </div>
        <div class="carrito-total">
            <h5>
                ${formatearPrecio(item.precio * item.cantidad)}

            </h5>
            <button class="btn-eliminar-reserva">

                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;
  const btnAumentar = tarjeta.querySelector(".aumentar");

  btnAumentar.addEventListener("click", () => {
    aumentarCantidad(item.id);
  });
  const btnDisminuir = tarjeta.querySelector(".disminuir");

  btnDisminuir.addEventListener("click", () => {
    disminuirCantidad(item.id);
  });

  const btnEliminar = tarjeta.querySelector(".btn-eliminar-reserva");

  btnEliminar.addEventListener("click", () => {
    eliminarReserva(item.id);
  });
  return tarjeta;
}

function renderizarCarrito() {
  const carrito = obtenerCarrito();

  listaCarrito.innerHTML = "";

  if (carrito.length === 0) {
    carritoVacio.classList.remove("d-none");

    actualizarResumen();

    return;
  }

  carritoVacio.classList.add("d-none");

  carrito.forEach((item) => {
    listaCarrito.appendChild(crearItemCarrito(item));
  });

  actualizarResumen();
}
function actualizarResumen() {
  const carrito = obtenerCarrito();

  let subtotal = 0;

  carrito.forEach((item) => {
    subtotal += item.precio * item.cantidad;
  });

  const iva = subtotal * 0.19;

  const descuento = 0;

  const total = subtotal + iva - descuento;

  subtotalEl.textContent = formatearPrecio(subtotal);
  ivaEl.textContent = formatearPrecio(iva);
  descuentoEl.textContent = formatearPrecio(descuento);
  totalEl.textContent = formatearPrecio(total);
}
function aumentarCantidad(id) {
  const carrito = obtenerCarrito();

  const item = carrito.find((destino) => destino.id === id);

  if (item) {
    item.cantidad++;
  }

  guardarCarrito(carrito);
  mostrarAlerta("Cantidad actualizada.", "success");
  renderizarCarrito();
}

function disminuirCantidad(id) {
  const carrito = obtenerCarrito();

  const item = carrito.find((destino) => destino.id === id);

  if (!item) return;

  if (item.cantidad > 1) {
    item.cantidad--;

    guardarCarrito(carrito);
    mostrarAlerta("Cantidad actualizada.", "info");
    renderizarCarrito();
  } else {
    mostrarAlerta(
      "La cantidad mínima es 1. Si deseas eliminar la reserva utiliza el botón de la papelera.",
      "warning",
    );
  }
}

function eliminarReserva(id) {
  const carrito = obtenerCarrito();

  const nuevoCarrito = carrito.filter((item) => item.id !== id);

  guardarCarrito(nuevoCarrito);
  mostrarAlerta("Reserva eliminada correctamente.", "danger");
  renderizarCarrito();
}
function vaciarCarrito() {

    const modal = new bootstrap.Modal(
        document.getElementById("modalVaciarCarrito")
    );

    modal.show();

}
function mostrarAlerta(mensaje, tipo = "success") {
  alertaCarrito.innerHTML = `

        <div class="alert alert-${tipo} alert-dismissible fade show shadow-sm" role="alert">

            ${mensaje}

            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert">
            </button>

        </div>

    `;

  setTimeout(() => {
    alertaCarrito.innerHTML = "";
  }, 3000);
}
function confirmarVaciarCarrito() {

  guardarCarrito([]);

  renderizarCarrito();

  mostrarAlerta(
    "Todas las reservas fueron eliminadas.",
    "danger"
  );

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("modalVaciarCarrito")
  );

  modal.hide();

}

btnVaciarCarrito.addEventListener("click", vaciarCarrito);
btnConfirmarVaciar.addEventListener("click", confirmarVaciarCarrito);

btnConfirmarReserva?.addEventListener("click", async () => {
  const sesion = window.Auth?.obtenerSesion();
  const carrito = obtenerCarrito();

  if (!carrito.length) {
    mostrarAlerta("Agrega al menos un destino antes de confirmar.", "warning");
    return;
  }

  if (!sesion?.usuarioId) {
    sessionStorage.setItem("postLoginRedirect", "carrito.html");
    mostrarAlerta("Debes iniciar sesión para confirmar tu reserva.", "warning");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1200);
    return;
  }

  btnConfirmarReserva.disabled = true;
  try {
    for (const item of carrito) {
      await window.API.crearReserva({
        usuarioId: sesion.usuarioId,
        paqueteId: item.paqueteId || item.id,
        numPersonas: item.cantidad,
      });
    }
    guardarCarrito([]);
    renderizarCarrito();
    window.mostrarModalReservaEmail?.({
      esConfirmacion: true,
      titulo: "¡Reserva confirmada!",
    });
  } catch (error) {
    mostrarAlerta(error.message || "No se pudo confirmar la reserva.", "danger");
  } finally {
    btnConfirmarReserva.disabled = false;
  }
});
