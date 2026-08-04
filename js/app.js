const STORAGE_KEY = "destinos";


const form = document.getElementById("formDestino");
const listaDestinosEl = document.getElementById("listaDestinos");
const emptyStateEl = document.getElementById("emptyState");
const contadorEl = document.getElementById("contador");
const alertaExitoEl = document.getElementById("alertaExito");
const btnLimpiarTodo = document.getElementById("btnLimpiarTodo");
const inputImagen = document.getElementById("imagen");
const imagenPreview = document.getElementById("imagenPreview");
const btnSubmit = form.querySelector('button[type="submit"]');
let idEditando = null;


inputImagen.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (ev) {
    const img = new Image();
    img.onload = function () {
      const MAX_ANCHO = 800;
      const escala = Math.min(1, MAX_ANCHO / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * escala;
      canvas.height = img.height * escala;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imagenComprimida = canvas.toDataURL("image/jpeg", 0.7);
      imagenPreview.src = imagenComprimida;
      imagenPreview.classList.remove("d-none");
    };
    img.src = ev.target.result;
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

  const datosFormulario = {
    nombre: document.getElementById("nombre").value.trim(),
    region: document.getElementById("region").value.trim(),
    descripcion: document.getElementById("descripcion").value.trim(),
    precio: Number(document.getElementById("precio").value),
    duracion: document.getElementById("duracion").value.trim(),
    categoria: document.getElementById("categoria").value,
    cupos: Number(document.getElementById("cupos").value),
    tipoViaje: document.getElementById("tipoViaje").value,
    imagen: imagenSrc,
  };

  if (idEditando !== null) {
    const index = destinos.findIndex((d) => d.id === idEditando);
    if (index !== -1) destinos[index] = { id: idEditando, ...datosFormulario };
  } else {
    const nuevoId = destinos.length > 0 ? Math.max(...destinos.map((d) => d.id)) + 1 : 1;
    destinos.push({ id: nuevoId, ...datosFormulario });
  }

  guardarDestinos(destinos);
  renderizarDestinos();
  mostrarAlertaExito();
  resetFormulario();
}

function resetFormulario() {
  form.reset();
  form.classList.remove("was-validated");
  imagenPreview.src = "";
  imagenPreview.classList.add("d-none");
  inputImagen.setCustomValidity("");
  inputImagen.required = true;
  idEditando = null;
  btnSubmit.innerHTML = '<i class="bi bi-check-circle"></i> Agregar destino';
}

function editarDestino(id) {
  const destinos = obtenerDestinos();
  const destino = destinos.find((d) => d.id === id);
  if (!destino) return;

  document.getElementById("nombre").value = destino.nombre;
  document.getElementById("region").value = destino.region;
  document.getElementById("descripcion").value = destino.descripcion;
  document.getElementById("precio").value = destino.precio;
  document.getElementById("duracion").value = destino.duracion;
  document.getElementById("categoria").value = destino.categoria;
  document.getElementById("cupos").value = destino.cupos;
  document.getElementById("tipoViaje").value = destino.tipoViaje || "";

  imagenPreview.src = destino.imagen;
  imagenPreview.classList.remove("d-none");
  inputImagen.required = false;
  inputImagen.setCustomValidity("");

  idEditando = id;
  btnSubmit.innerHTML = '<i class="bi bi-check-circle"></i> Guardar cambios';
  form.classList.remove("was-validated");
  form.scrollIntoView({ behavior: "smooth", block: "start" });
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
        <button class="btn btn-sm btn-light btn-editar" data-id="${destino.id}" title="Editar destino">
          <i class="bi bi-pencil-fill text-primary"></i>
        </button>
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
        <p class="small text-muted mb-2"><i class="bi bi-people"></i> ${destino.tipoViaje || "Tipo de viaje por definir"}</p>
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

  col.querySelector(".btn-editar").addEventListener("click", () => {
    editarDestino(destino.id);
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
  resetFormulario();
});

inputImagen.addEventListener("change", () => {
  inputImagen.setCustomValidity("");
});


document.addEventListener("DOMContentLoaded", renderizarDestinos);
<<<<<<< HEAD

// Refresca el listado si el catálogo o una segunda pestaña modifica los datos.
=======
>>>>>>> 5ea5dca (parte1)
window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEY) renderizarDestinos();
});
