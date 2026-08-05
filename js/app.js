const form = document.getElementById("formDestino");
const listaDestinosEl = document.getElementById("listaDestinos");
const emptyStateEl = document.getElementById("emptyState");
const contadorEl = document.getElementById("contador");
const alertaExitoEl = document.getElementById("alertaExito");
const alertaErrorEl = document.getElementById("alertaError");
const btnLimpiarTodo = document.getElementById("btnLimpiarTodo");
const inputImagenUrl = document.getElementById("imagenUrl");
const imagenPreview = document.getElementById("imagenPreview");
const btnSubmit = form.querySelector('button[type="submit"]');

let paquetesCache = [];
let idEditando = null;
let destinoIdEditando = null;

function parseRegion(region) {
  const partes = String(region || "").split(",").map((parte) => parte.trim()).filter(Boolean);
  return {
    ciudad: partes[0] || region || "Colombia",
    pais: partes[1] || "Colombia",
  };
}

function parseDuracionDias(duracion) {
  const coincidencia = String(duracion || "").match(/\d+/);
  return coincidencia ? Number(coincidencia[0]) : 1;
}

function actualizarPreviewImagen(url) {
  if (!url) {
    imagenPreview.src = "";
    imagenPreview.classList.add("d-none");
    return;
  }
  imagenPreview.src = url;
  imagenPreview.classList.remove("d-none");
}

inputImagenUrl?.addEventListener("input", () => {
  actualizarPreviewImagen(inputImagenUrl.value.trim());
});

async function cargarPaquetes() {
  const pagina = await window.API.getPaquetesDetalle(0, 50);
  paquetesCache = pagina.content || [];
  renderizarDestinos();
}

function obtenerDatosFormulario() {
  const region = document.getElementById("region").value.trim();
  const { ciudad, pais } = parseRegion(region);
  const duracion = document.getElementById("duracion").value.trim();

  return {
    nombre: document.getElementById("nombre").value.trim(),
    region,
    ciudad,
    pais,
    descripcion: document.getElementById("descripcion").value.trim(),
    precio: Number(document.getElementById("precio").value),
    duracion,
    duracionDias: parseDuracionDias(duracion),
    categoria: document.getElementById("categoria").value,
    cupos: Number(document.getElementById("cupos").value),
    tipoViaje: document.getElementById("tipoViaje").value,
    imagenUrl: inputImagenUrl.value.trim(),
  };
}

async function guardarDestino(evento) {
  evento.preventDefault();

  if (!form.checkValidity()) {
    evento.stopPropagation();
    form.classList.add("was-validated");
    return;
  }

  const datos = obtenerDatosFormulario();
  if (!datos.imagenUrl) {
    inputImagenUrl.setCustomValidity("Ingresa la URL de la imagen.");
    form.classList.add("was-validated");
    return;
  }
  inputImagenUrl.setCustomValidity("");

  btnSubmit.disabled = true;
  ocultarAlertaError();

  try {
    if (idEditando !== null) {
      await window.API.actualizarDestino(destinoIdEditando, {
        destinoId: destinoIdEditando,
        nombre: datos.nombre,
        ciudad: datos.ciudad,
        pais: datos.pais,
        descripcion: datos.descripcion,
      });

      await window.API.actualizarPaquete(idEditando, {
        paqueteId: idEditando,
        destinoId: destinoIdEditando,
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        precio: datos.precio,
        duracionDias: datos.duracionDias,
        duracionTexto: datos.duracion,
        cupoMaximo: datos.cupos,
        imagenUrl: datos.imagenUrl,
        categoria: datos.categoria,
        tipoViaje: datos.tipoViaje,
        servicios: "Hotel,Transporte,Alimentación",
      });
    } else {
      const destino = await window.API.crearDestino({
        nombre: datos.nombre,
        ciudad: datos.ciudad,
        pais: datos.pais,
        descripcion: datos.descripcion,
      });

      await window.API.crearPaquete({
        destinoId: destino.destinoId,
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        precio: datos.precio,
        duracionDias: datos.duracionDias,
        duracionTexto: datos.duracion,
        cupoMaximo: datos.cupos,
        imagenUrl: datos.imagenUrl,
        categoria: datos.categoria,
        tipoViaje: datos.tipoViaje,
        servicios: "Hotel,Transporte,Alimentación",
      });
    }

    await cargarPaquetes();
    mostrarAlertaExito();
    resetFormulario();
  } catch (error) {
    mostrarAlertaError(error.message || "No se pudo guardar el destino.");
  } finally {
    btnSubmit.disabled = false;
  }
}

function resetFormulario() {
  form.reset();
  form.classList.remove("was-validated");
  actualizarPreviewImagen("");
  inputImagenUrl.setCustomValidity("");
  idEditando = null;
  destinoIdEditando = null;
  btnSubmit.innerHTML = '<i class="bi bi-check-circle"></i> Agregar destino';
}

function editarDestino(id) {
  const destino = paquetesCache.find((item) => item.paqueteId === id);
  if (!destino) return;

  document.getElementById("nombre").value = destino.nombre;
  document.getElementById("region").value = destino.region;
  document.getElementById("descripcion").value = destino.descripcion;
  document.getElementById("precio").value = destino.precio;
  document.getElementById("duracion").value = destino.duracion;
  document.getElementById("categoria").value = destino.categoria;
  document.getElementById("cupos").value = destino.cupos;
  document.getElementById("tipoViaje").value = destino.tipoViaje || "";
  inputImagenUrl.value = destino.imagen?.startsWith("http") ? destino.imagen : "";
  actualizarPreviewImagen(inputImagenUrl.value || destino.imagen);

  idEditando = destino.paqueteId;
  destinoIdEditando = destino.destinoId;
  btnSubmit.innerHTML = '<i class="bi bi-check-circle"></i> Guardar cambios';
  form.classList.remove("was-validated");
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function eliminarDestino(id) {
  const paquete = paquetesCache.find((item) => item.paqueteId === id);
  if (!paquete) return;

  if (!confirm(`¿Eliminar el paquete "${paquete.nombre}"?`)) return;

  try {
    await window.API.eliminarPaquete(id);
    if (paquete.destinoId) {
      await window.API.eliminarDestino(paquete.destinoId).catch(() => {});
    }
    if (idEditando === id) resetFormulario();
    await cargarPaquetes();
    mostrarAlertaExito("Destino eliminado correctamente.");
  } catch (error) {
    mostrarAlertaError(error.message || "No se pudo eliminar el destino.");
  }
}

async function vaciarLista() {
  if (!paquetesCache.length) return;
  if (!confirm("¿Seguro que deseas eliminar TODOS los destinos publicados?")) return;

  try {
    for (const paquete of paquetesCache) {
      await window.API.eliminarPaquete(paquete.paqueteId);
      if (paquete.destinoId) {
        await window.API.eliminarDestino(paquete.destinoId).catch(() => {});
      }
    }
    resetFormulario();
    await cargarPaquetes();
    mostrarAlertaExito("Todos los destinos fueron eliminados.");
  } catch (error) {
    mostrarAlertaError(error.message || "No se pudo vaciar la lista.");
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
        <button class="btn btn-sm btn-light btn-editar" data-id="${destino.paqueteId}" title="Editar destino">
          <i class="bi bi-pencil-fill text-primary"></i>
        </button>
        <button class="btn btn-sm btn-light btn-eliminar" data-id="${destino.paqueteId}" title="Eliminar destino">
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
    eliminarDestino(destino.paqueteId);
  });

  col.querySelector(".btn-editar").addEventListener("click", () => {
    editarDestino(destino.paqueteId);
  });

  return col;
}

function renderizarDestinos() {
  listaDestinosEl.innerHTML = "";
  contadorEl.textContent = paquetesCache.length;

  if (!paquetesCache.length) {
    emptyStateEl.classList.remove("d-none");
    return;
  }

  emptyStateEl.classList.add("d-none");
  paquetesCache.forEach((destino) => {
    listaDestinosEl.appendChild(crearCardDestino(destino));
  });
}

function mostrarAlertaExito(mensaje = "¡Destino guardado correctamente!") {
  alertaExitoEl.innerHTML = `<i class="bi bi-check-circle-fill"></i> ${mensaje}`;
  alertaExitoEl.classList.remove("d-none");
  setTimeout(() => alertaExitoEl.classList.add("d-none"), 2500);
}

function mostrarAlertaError(mensaje) {
  if (!alertaErrorEl) return;
  alertaErrorEl.textContent = mensaje;
  alertaErrorEl.classList.remove("d-none");
}

function ocultarAlertaError() {
  if (!alertaErrorEl) return;
  alertaErrorEl.classList.add("d-none");
  alertaErrorEl.textContent = "";
}

form.addEventListener("submit", guardarDestino);
btnLimpiarTodo.addEventListener("click", vaciarLista);
document.getElementById("btnLimpiar").addEventListener("click", resetFormulario);

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await cargarPaquetes();
  } catch (error) {
    mostrarAlertaError(error.message || "No se pudo cargar el listado desde la API.");
  }
});
