const STORAGE_KEY = "destinos";


const form = document.getElementById("formDestino");
const listaDestinosEl = document.getElementById("listaDestinos");
const emptyStateEl = document.getElementById("emptyState");
const contadorEl = document.getElementById("contador");
const alertaExitoEl = document.getElementById("alertaExito");
const btnLimpiarTodo = document.getElementById("btnLimpiarTodo");
const inputImagen = document.getElementById("imagen");
const imagenPreview = document.getElementById("imagenPreview");


inputImagen.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (ev) {
    imagenPreview.src = ev.target.result;
    imagenPreview.classList.remove("d-none");
  };
  reader.readAsDataURL(file);
});


function obtenerDestinos() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function guardarDestinos(destinos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(destinos));
  console.log("=== LISTA DE DESTINOS ACTUALIZADA (JSON) ===");
  console.log(JSON.stringify(destinos, null, 2));
}


function agregarDestino(e) {
  e.preventDefault();

  if (!form.checkValidity()) {
    e.stopPropagation();
    form.classList.add("was-validated");
    return;
  }


  const imagenSrc = imagenPreview.src;
  if (!imagenSrc || imagenSrc === window.location.href) {
    inputImagen.setCustomValidity("Debes seleccionar una imagen.");
    form.classList.add("was-validated");
    return;
  }
  inputImagen.setCustomValidity("");

  const destinos = obtenerDestinos();
  const nuevoId = destinos.length > 0 ? Math.max(...destinos.map((d) => d.id)) + 1 : 1;

  const nuevoDestino = {
    id: nuevoId,
    nombre: document.getElementById("nombre").value.trim(),
    region: document.getElementById("region").value.trim(),
    descripcion: document.getElementById("descripcion").value.trim(),
    precio: Number(document.getElementById("precio").value),
    duracion: document.getElementById("duracion").value.trim(),
    categoria: document.getElementById("categoria").value,
    cupos: Number(document.getElementById("cupos").value),
    imagen: imagenSrc, // Base64 de la imagen subida
  };

  destinos.push(nuevoDestino);
  guardarDestinos(destinos);
  renderizarDestinos();
  mostrarAlertaExito();


  form.reset();
  form.classList.remove("was-validated");
  imagenPreview.src = "";
  imagenPreview.classList.add("d-none");
  inputImagen.setCustomValidity("");
}

function eliminarDestino(id) {
  let destinos = obtenerDestinos();
  destinos = destinos.filter((d) => d.id !== id);
  guardarDestinos(destinos);
  renderizarDestinos();
}

function vaciarLista() {
  const confirmar = confirm("¿Seguro que deseas eliminar TODOS los destinos?");
  if (confirmar) {
    guardarDestinos([]);
    renderizarDestinos();
  }
}


function formatearPrecio(precio) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(precio);
}


function crearCardDestino(destino) {
  const col = document.createElement("div");
  col.className = "col-12 col-sm-6";

  col.innerHTML = `
    <div class="card destino-card">
      <div class="destino-img-wrapper">
        <button class="btn btn-sm btn-light btn-eliminar" data-id="${destino.id}" title="Eliminar destino">
          <i class="bi bi-trash3-fill text-danger"></i>
        </button>
        <img
          src="${destino.imagen}"
          alt="${destino.nombre}"
          onerror="this.src='https://placehold.co/600x300/2e6a50/ffffff?text=Destino+Colombia'"
        />
      </div>
      <div class="card-body d-flex flex-column">
        <h5 class="card-title text-navy mb-1">${destino.nombre}</h5>
        <p class="text-muted small mb-2"><i class="bi bi-geo-alt"></i> ${destino.region}</p>
        <span class="badge categoria-badge mb-2 align-self-start">${destino.categoria}</span>
        <p class="small text-secondary text-truncate-3">${destino.descripcion}</p>
        <div class="mt-auto pt-2">
          <p class="precio-tag mb-1">${formatearPrecio(destino.precio)}</p>
          <p class="small text-muted mb-0">
            <i class="bi bi-clock"></i> ${destino.duracion}
            &middot;
            <i class="bi bi-people"></i> ${destino.cupos} cupos
          </p>
        </div>
      </div>
    </div>
  `;

  col.querySelector(".btn-eliminar").addEventListener("click", () => {
    eliminarDestino(destino.id);
  });

  return col;
}


function renderizarDestinos() {
  const destinos = obtenerDestinos();
  listaDestinosEl.innerHTML = "";
  contadorEl.textContent = destinos.length;

  if (destinos.length === 0) {
    emptyStateEl.classList.remove("d-none");
    return;
  }

  emptyStateEl.classList.add("d-none");
  destinos.forEach((destino) => {
    listaDestinosEl.appendChild(crearCardDestino(destino));
  });
}

function mostrarAlertaExito() {
  alertaExitoEl.classList.remove("d-none");
  setTimeout(() => alertaExitoEl.classList.add("d-none"), 2500);
}


form.addEventListener("submit", agregarDestino);



btnLimpiarTodo.addEventListener("click", vaciarLista);

document.getElementById("btnLimpiar").addEventListener("click", () => {
  form.classList.remove("was-validated");
  imagenPreview.src = "";
  imagenPreview.classList.add("d-none");
  inputImagen.setCustomValidity("");
});

inputImagen.addEventListener("change", () => {
  inputImagen.setCustomValidity("");
});


document.addEventListener("DOMContentLoaded", renderizarDestinos);