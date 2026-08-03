/* ============================================================
   home-carousel.js — Carrusel de destinos en el Home
   Lee los destinos guardados en localStorage (sembrados por seed.js)
   y genera los slides del carrusel Bootstrap dinámicamente.
   ============================================================ */
(function () {
  const CATALOGO_URL = "html/catalogo.html";
  const MAX_SLIDES = 5;

  function obtenerDestinos() {
    const data = localStorage.getItem("destinos");
    return data ? JSON.parse(data) : [];
  }

  function crearSlide(destino, index) {
    return `
      <div class="carousel-item ${index === 0 ? "active" : ""}">
        <div class="carrusel-destino-slide">
          <img src="assets/images/hero.png" alt="${destino.nombre}">
          <div class="carrusel-destino-overlay">
            <span class="categoria-tag">${destino.categoria}</span>
            <h3>${destino.nombre}</h3>
            <p class="mb-0">${destino.region}</p>
            <a href="${CATALOGO_URL}" class="btn btn-ver-destino">
              Ver este destino <i class="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>`;
  }

  function renderizarCarrusel() {
    const contenedor = document.getElementById("carruselDestinosInner");
    if (!contenedor) return;

    const destinos = obtenerDestinos().slice(0, MAX_SLIDES);

    if (destinos.length === 0) {
      contenedor.innerHTML = `<div class="carousel-item active"><p class="text-center py-5">Muy pronto nuevos destinos.</p></div>`;
      return;
    }

    contenedor.innerHTML = destinos.map(crearSlide).join("");
  }

  document.addEventListener("DOMContentLoaded", renderizarCarrusel);
})();
