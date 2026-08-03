// CONFIGURACIÓN
const STORAGE_KEY = "destinos";
const ICONOS_SERVICIOS = {
  Hotel: "bi-building",
  Transporte: "bi-bus-front",
  Alimentación: "bi-cup-hot",
  Guía: "bi-person-badge",
  Piscina: "bi-water",
  Wifi: "bi-wifi",
  Desayuno: "bi-cup-straw",
};
// ELEMENTOS DEL DOM
const listaPublicaEl = document.getElementById("listaPublicaDestinos");
const sinDestinosEl = document.getElementById("sinDestinos");
const botonesCategoria = document.querySelectorAll("#filtrosCategoria .btn-filtro");
const botonesGrupo = document.querySelectorAll(".btn-filtro-grupo");

// ESTADO DE FILTROS
const filtros = {
  categoria: "todos",
  tipoViaje: "todos",
};
// UTILIDADES
function formatearPrecio(precio) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(precio);
}
function obtenerDestinos() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}
function obtenerCarrito() {
  const carrito = localStorage.getItem("carrito");
  return carrito ? JSON.parse(carrito) : [];
}
function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}
function agregarAlCarrito(destino) {
  const carrito = obtenerCarrito();
  const destinoExistente = carrito.find((item) => item.id === destino.id);
  if (destinoExistente) {
    destinoExistente.cantidad++;
  } else {
    carrito.push({
      id: destino.id,
      nombre: destino.nombre,
      precio: destino.precio,
      imagen: destino.imagen,
      region: destino.region,
      duracion: destino.duracion,
      categoria: destino.categoria,
      cantidad: 1,
    });
  }
  guardarCarrito(carrito);
  window.actualizarContadorCarrito?.();
}
function crearServiciosHTML(servicios) {
  return servicios
    .map(
      (servicio) => `
        <span>
            <i class="bi ${
              ICONOS_SERVICIOS[servicio] || "bi-check-circle-fill"
            }"></i>
            ${servicio}
        </span>
    `,
    )
    .join("");
}
// TARJETA DEL CATÁLOGO
function crearCardPublica(destino) {
  const col = document.createElement("div");
  col.className = "col-lg-4 col-md-6";

  // Valores por defecto
  const rating = destino.rating ?? 4.8;
  const resenas = destino.resenas ?? 120;

  const servicios = destino.servicios ?? [
    "Hotel",
    "Transporte",
    "Alimentación",
  ];

  const serviciosHTML = crearServiciosHTML(servicios);

  col.innerHTML = `
    <div class="card destino-card h-100">

      <div class="destino-img">

        <img
          src="${destino.imagen}"
          alt="${destino.nombre}"
          onerror="this.src='../assets/images/hero.png'"
        >

        <span class="categoria">
          ${destino.categoria}
        </span>

        <button class="favorito">
          <i class="bi bi-heart"></i>
        </button>

        <span class="oferta-badge">
          🔥 Más reservado
        </span>

      </div>

      <div class="card-body">

        <div class="d-flex justify-content-between align-items-center">

          <div class="rating">
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-half"></i>

            <span>${rating}</span>
          </div>

          <small class="text-muted">
            ${resenas} reseñas
          </small>

        </div>

        <h4 class="destino-titulo">
          ${destino.nombre}
        </h4>

        <p class="ubicacion">
          <i class="bi bi-geo-alt-fill"></i>
          ${destino.region}
        </p>

        <p class="frase-destino">
          ${destino.descripcion}
        </p>

        <div class="servicios">
          ${serviciosHTML}
        </div>

        <hr>

        <div class="d-flex justify-content-between align-items-center">

          <div>

            <small class="precio-label">
              Desde
            </small>

            <h3 class="precio">
              ${formatearPrecio(destino.precio)}
            </h3>

          </div>

          <span class="dias">
            ${destino.duracion}
          </span>

        </div>

        <div class="d-grid mt-4">

          <button
            class="btn btn-reservar reservar-btn"
            data-id="${destino.id}">

            <i class="bi bi-calendar-check"></i>

            Reservar ahora

          </button>

        </div>

      </div>

    </div>
  `;
  // Botón Reservar
  const btnReservar = col.querySelector(".reservar-btn");

  btnReservar.addEventListener("click", () => {
    agregarAlCarrito(destino);
  });
  // Favoritos
  const btnFavorito = col.querySelector(".favorito");
  const icono = btnFavorito.querySelector("i");

  btnFavorito.addEventListener("click", () => {
    icono.classList.toggle("bi-heart");
    icono.classList.toggle("bi-heart-fill");

    icono.style.color = icono.classList.contains("bi-heart-fill")
      ? "#dc3545"
      : "#555";
  });

  return col;
}
// FILTRADO
function aplicarFiltros(destinos) {
  return destinos.filter((destino) => {
    const coincideCategoria =
      filtros.categoria === "todos" || destino.categoria === filtros.categoria;
    const coincideTipo =
      filtros.tipoViaje === "todos" || destino.tipoViaje === filtros.tipoViaje;
    return coincideCategoria && coincideTipo;
  });
}

// RENDER DEL CATÁLOGO
function renderizarCatalogo() {
  const destinos = aplicarFiltros(obtenerDestinos());

  listaPublicaEl.innerHTML = "";

  if (destinos.length === 0) {
    sinDestinosEl.classList.remove("d-none");
    return;
  }

  sinDestinosEl.classList.add("d-none");

  destinos.forEach((destino) => {
    listaPublicaEl.appendChild(crearCardPublica(destino));
  });
}

// LISTENERS DE FILTROS
botonesCategoria.forEach((btn) => {
  btn.addEventListener("click", () => {
    botonesCategoria.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    filtros.categoria = btn.dataset.categoria;
    renderizarCatalogo();
  });
});

botonesGrupo.forEach((btn) => {
  btn.addEventListener("click", () => {
    botonesGrupo.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    filtros.tipoViaje = btn.dataset.tipo;
    renderizarCatalogo();
  });
});

// INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
  renderizarCatalogo();
});
