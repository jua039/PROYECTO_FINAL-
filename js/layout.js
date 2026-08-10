(function () {
  const scriptTag = document.currentScript;
  const base = scriptTag?.dataset.base || ".";
  const html = base === "." ? "html" : ".";
  const page = document.body.dataset.page || "";
  const sesion = window.Auth?.obtenerSesion?.() || null;
  const esAdmin = sesion?.rol === "admin" || localStorage.getItem("rolAdmin") === "true";
  const instagramLink = "https://www.instagram.com/parchemos_travel?igsh=MW9meWdhdW40aDR3dg==";
  const tiktokLink = "https://www.tiktok.com/@parchemos_travel?is_from_webapp=1&sender_device=pc";
  const whatsappNumber = "573213347179";
  const whatsappMessage = "Hola, quiero hacer una reserva";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const NAV_LINKS = [
    { href: `${base}/index.html`, label: "Inicio", key: "inicio" },
    { href: `${html}/catalogo.html`, label: "Destinos", key: "destinos" },
    { href: `${html}/pag.html`, label: "Experiencias", key: "experiencias" },
    { href: `${html}/nosotros.html`, label: "Nosotros", key: "nosotros" },
    { href: `${html}/contactenos.html`, label: "Contacto", key: "contacto" },
  ];

  function activo(key) { return page === key ? " active" : ""; }
  function obtenerCarrito() { return JSON.parse(localStorage.getItem("carrito")) || []; }
  function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>'"]/g, (caracter) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[caracter]);
  }
  function formatearFechaReserva(fecha) {
    return fecha ? new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(fecha)) : "Fecha pendiente de confirmación";
  }
  function renderizarCarritoFlotante(carrito = obtenerCarrito()) {
    const lista = document.getElementById("listaCarritoFlotante");
    if (!lista) return;
    lista.innerHTML = carrito.length
      ? carrito.map((item) => `<li class="reserva-flotante-item"><div><strong>${escaparHTML(item.nombre)}</strong><span>${formatearFechaReserva(item.fechaReserva)}</span></div><button type="button" class="eliminar-reserva-flotante" data-id="${escaparHTML(item.id)}" aria-label="Eliminar reserva ${escaparHTML(item.nombre)}"><i class="bi bi-trash3"></i></button></li>`).join("")
      : '<li class="carrito-flotante-vacio">Aún no tienes reservas activas.</li>';
  }
  function abrirCarritoFlotante() {
    const panel = document.getElementById("panelCarritoFlotante");
    panel?.classList.add("abierto");
    panel?.setAttribute("aria-hidden", "false");
  }
  function cerrarCarritoFlotante() {
    const panel = document.getElementById("panelCarritoFlotante");
    panel?.classList.remove("abierto");
    panel?.setAttribute("aria-hidden", "true");
  }
  window.abrirCarritoFlotante = abrirCarritoFlotante;
  window.actualizarContadorCarrito = function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const cantidad = carrito.reduce((total, item) => total + item.cantidad, 0);
    document.querySelectorAll("#contadorCarrito, #contadorCarritoFlotante").forEach((el) => {
      el.textContent = cantidad;
      if (el.id === "contadorCarrito") {
        el.classList.toggle("d-none", cantidad === 0);
      }
    });
    renderizarCarritoFlotante(carrito);
  };
  window.mostrarConfirmacionReserva = function mostrarConfirmacionReserva() {
    const aviso = document.getElementById("toastReservaExitosa");
    if (!aviso) return;
    aviso.classList.add("visible");
    clearTimeout(window.cierreToastReserva);
    window.cierreToastReserva = setTimeout(() => aviso.classList.remove("visible"), 5000);
  };

  const navAuthHTML = sesion
    ? `<span class="navbar-user-pill d-none d-md-inline-flex" title="${escaparHTML(sesion.nombres)}"><i class="bi bi-person-circle"></i>${escaparHTML(sesion.nombres)}</span>
       <button type="button" class="btn btn-login btn-sm" id="btnCerrarSesionNav">Salir</button>`
    : `<a href="${html}/login.html" class="btn btn-login">Iniciar sesión</a>
       <a href="${html}/registro.html" class="btn btn-register">Registrarse</a>`;

  const navHTML = `<nav class="navbar navbar-expand-lg custom-navbar"><div class="container"><a href="${base}/index.html" class="navbar-brand d-flex align-items-center gap-2 logo-pill"><img src="${base}/assets/images/logo_solo_transparente.png" alt="Parchemos Travel" class="navbar-logo"><span class="brand-text">Parchemos <span class="brand-sub">Travel</span></span></a><button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="navbarNav"><ul class="navbar-nav mx-auto">${NAV_LINKS.map((l) => `<li class="nav-item"><a href="${l.href}" class="nav-link${activo(l.key)}">${l.label}</a></li>`).join("")}</ul><div class="d-flex gap-2 align-items-center">${navAuthHTML}<a href="${html}/carrito.html" class="btn btn-carrito position-relative" aria-label="Reservas" title="Reservas"><i class="bi bi-wallet2" aria-hidden="true"></i><span id="contadorCarrito" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">0</span></a>${esAdmin ? `<a href="${html}/dashboard.html" class="btn-admin-gear" title="Panel de administrador"><i class="bi bi-gear-fill"></i></a>` : ""}</div></div></div></nav>`;
  const footerHTML = `<footer class="site-footer"><div class="container"><div class="row gy-4"><div class="col-lg-4 col-md-6"><h5 class="footer-brand">Parchemos Travel</h5><p>Viajes personalizados, experiencias auténticas y atención humana para explorar cada rincón de Colombia como un verdadero parcero.</p></div><div class="col-lg-2 col-md-6"><h6>Explora</h6><ul class="footer-links"><li><a href="${base}/index.html">Inicio</a></li><li><a href="${html}/catalogo.html">Destinos</a></li><li><a href="${html}/pag.html">Experiencias</a></li></ul></div><div class="col-lg-3 col-md-6"><h6>Compañía</h6><ul class="footer-links"><li><a href="${html}/nosotros.html">Nosotros</a></li><li><a href="${html}/historia.html">Nuestra historia</a></li><li><a href="${html}/contactenos.html">Contacto</a></li></ul></div><div class="col-lg-3 col-md-6"><h6>Síguenos</h6><div class="footer-social"><a href="${instagramLink}" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="bi bi-instagram"></i></a><a href="${tiktokLink}" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><i class="bi bi-tiktok"></i></a><a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a></div></div></div><hr><p class="text-center mb-0 small">Generation Colombia · Cohorte 12 · Parchemos Travel &copy; 2026</p></div></footer>`;

  function montar() {
    const navRoot = document.getElementById("navbar-root");
    const footerRoot = document.getElementById("footer-root");
    if (navRoot) navRoot.innerHTML = navHTML;
    if (footerRoot) footerRoot.innerHTML = footerHTML;
    document.body.insertAdjacentHTML("beforeend", `<button id="botonCarritoFlotante" class="carrito-flotante-boton" type="button" aria-label="Ver reservas" aria-controls="panelCarritoFlotante" aria-expanded="false"><i class="bi bi-cart3"></i><span id="contadorCarritoFlotante" class="carrito-flotante-contador">0</span></button><aside id="panelCarritoFlotante" class="carrito-flotante-panel" aria-hidden="true" aria-label="Reservas activas"><div class="carrito-flotante-encabezado"><h2>Mis reservas</h2><button id="cerrarCarritoFlotante" type="button" aria-label="Cerrar"><i class="bi bi-x-lg"></i></button></div><ul id="listaCarritoFlotante"></ul><a href="${html}/carrito.html" class="btn btn-reservar w-100">Ver detalle de reservas</a></aside><div id="toastReservaExitosa" class="toast-reserva" role="status" aria-live="polite"><button type="button" class="toast-reserva-cerrar" aria-label="Cerrar">&times;</button><strong>Reserva con éxito</strong><button type="button" class="toast-reserva-ver">Ver mi reserva</button></div>`);
    document.getElementById("botonCarritoFlotante")?.addEventListener("click", () => { abrirCarritoFlotante(); document.getElementById("botonCarritoFlotante").setAttribute("aria-expanded", "true"); });
    document.getElementById("cerrarCarritoFlotante")?.addEventListener("click", cerrarCarritoFlotante);
    document.querySelector(".toast-reserva-cerrar")?.addEventListener("click", () => document.getElementById("toastReservaExitosa")?.classList.remove("visible"));
    document.querySelector(".toast-reserva-ver")?.addEventListener("click", () => { abrirCarritoFlotante(); document.getElementById("toastReservaExitosa")?.classList.remove("visible"); });
    document.getElementById("listaCarritoFlotante")?.addEventListener("click", (evento) => {
      const boton = evento.target.closest(".eliminar-reserva-flotante");
      if (!boton) return;
      localStorage.setItem("carrito", JSON.stringify(obtenerCarrito().filter((item) => String(item.id) !== boton.dataset.id)));
      window.actualizarContadorCarrito();
      window.dispatchEvent(new Event("reservas-actualizadas"));
    });
    document.getElementById("btnCerrarSesionNav")?.addEventListener("click", () => {
      window.Auth?.cerrarSesion?.();
      window.location.href = `${base}/index.html`;
    });
    window.actualizarContadorCarrito();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montar); else montar();
})();