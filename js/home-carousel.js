<<<<<<< HEAD
/* Carrusel de tarjetas de destinos para Inicio. */
=======

>>>>>>> 5ea5dca (parte1)
(function () {
  const CATALOGO_URL = "html/catalogo.html";
  const DESTINOS_POR_SLIDE = 3;

  function obtenerDestinos() {
    try {
      return JSON.parse(localStorage.getItem("destinos") || "[]");
    } catch {
      return [];
    }
  }

  function formatearPrecio(precio) {
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(precio);
  }

  function crearTarjeta(destino) {
    const imagen = destino.imagen || "assets/images/hero.png";
    return `
      <article class="home-destino-card">
        <img src="${imagen}" alt="${destino.nombre}" onerror="this.src='assets/images/hero.png'">
        <div class="home-destino-card-body">
          <span class="categoria-tag">${destino.categoria}</span>
          <h3>${destino.nombre}</h3>
          <p><i class="bi bi-geo-alt"></i> ${destino.region}</p>
          <div class="home-destino-card-footer">
            <strong>Desde ${formatearPrecio(destino.precio)}</strong>
            <a href="${CATALOGO_URL}" aria-label="Ver ${destino.nombre}"><i class="bi bi-arrow-right"></i></a>
          </div>
        </div>
      </article>`;
  }

  function dividirEnGrupos(lista, tamano) {
    return Array.from({ length: Math.ceil(lista.length / tamano) }, (_, indice) =>
      lista.slice(indice * tamano, indice * tamano + tamano)
    );
  }

  function renderizarCarrusel() {
    const contenedor = document.getElementById("carruselDestinosInner");
    const indicadores = document.getElementById("carruselDestinosIndicadores");
    if (!contenedor || !indicadores) return;

    const grupos = dividirEnGrupos(obtenerDestinos(), DESTINOS_POR_SLIDE);
    if (!grupos.length) {
      contenedor.innerHTML = '<div class="carousel-item active"><p class="text-center py-5">Muy pronto nuevos destinos.</p></div>';
      indicadores.innerHTML = "";
      return;
    }

    contenedor.innerHTML = grupos.map((grupo, indice) => `
      <div class="carousel-item ${indice === 0 ? "active" : ""}">
        <div class="home-destinos-grid">${grupo.map(crearTarjeta).join("")}</div>
      </div>`).join("");
    indicadores.innerHTML = grupos.map((_, indice) => `
      <button type="button" data-bs-target="#carruselDestinos" data-bs-slide-to="${indice}"
        class="${indice === 0 ? "active" : ""}" ${indice === 0 ? 'aria-current="true"' : ""}
        aria-label="Diapositiva ${indice + 1}"></button>`).join("");
  }

  document.addEventListener("DOMContentLoaded", renderizarCarrusel);
})();
