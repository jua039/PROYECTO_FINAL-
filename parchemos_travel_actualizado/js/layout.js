/* ============================================================
   layout.js — Navbar y Footer globales de Parchemos Travel
   Se incluye así: <script src="{ruta}/js/layout.js" data-base="{..|.}"></script>
   data-base = ".."  -> páginas dentro de /html
   data-base = "."   -> páginas en la raíz (index.html)
   ============================================================ */
(function () {
  const scriptTag = document.currentScript;
  const base = scriptTag?.dataset.base || ".";
  const html = base === "." ? "html" : ".";
  const page = document.body.dataset.page || "";
  const esAdmin = localStorage.getItem("rolAdmin") === "true";
  const instagramLink = "https://www.instagram.com/parchemos_travel?igsh=MW9meWdhdW40aDR3dg==";
  const tiktokLink = "https://www.tiktok.com/@parchemos_travel?is_from_webapp=1&sender_device=pc";
  const whatsappLink = "";

  const NAV_LINKS = [
    { href: `${base}/index.html`, label: "Inicio", key: "inicio" },
    { href: `${html}/catalogo.html`, label: "Destinos", key: "destinos" },
    { href: `${html}/pag.html`, label: "Experiencias", key: "experiencias" },
    { href: `${html}/nosotros.html`, label: "Nosotros", key: "nosotros" },
    { href: `${html}/contactenos.html`, label: "Contacto", key: "contacto" },
  ];

  function activo(key) {
    return page === key ? " active" : "";
  }

  const navHTML = `
    <nav class="navbar navbar-expand-lg custom-navbar">
      <div class="container">
        <a href="${base}/index.html" class="navbar-brand">Parchemos Travel</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mx-auto">
            ${NAV_LINKS.map(
              (l) =>
                `<li class="nav-item"><a href="${l.href}" class="nav-link${activo(l.key)}">${l.label}</a></li>`
            ).join("")}
          </ul>
          <div class="d-flex gap-2 align-items-center">
            <a href="${html}/login.html" class="btn btn-login">Iniciar sesión</a>
            <a href="${html}/registro.html" class="btn btn-register">Registrarse</a>
            <a href="${html}/carrito.html" class="btn btn-carrito position-relative">
              <i class="bi bi-cart3"></i>
              Reservas
              <span id="contadorCarrito" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">0</span>
            </a>
            ${esAdmin
              ? `<a href="${html}/dashboard.html" class="btn-admin-gear" title="Panel de administrador">
              <i class="bi bi-gear-fill"></i>
            </a>`
              : ""
            }
          </div>
        </div>
      </div>
    </nav>`;

  const footerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="row gy-4">
          <div class="col-lg-4 col-md-6">
            <h5 class="footer-brand">Parchemos Travel</h5>
            <p>Viajes personalizados, experiencias auténticas y atención humana para explorar cada rincón de Colombia como un verdadero parcero.</p>
          </div>
          <div class="col-lg-2 col-md-6">
            <h6>Explora</h6>
            <ul class="footer-links">
              <li><a href="${base}/index.html">Inicio</a></li>
              <li><a href="${html}/catalogo.html">Destinos</a></li>
              <li><a href="${html}/pag.html">Experiencias</a></li>
            </ul>
          </div>
          <div class="col-lg-3 col-md-6">
            <h6>Compañía</h6>
            <ul class="footer-links">
              <li><a href="${html}/nosotros.html">Nosotros</a></li>
              <li><a href="${html}/historia.html">Nuestra historia</a></li>
              <li><a href="${html}/contactenos.html">Contacto</a></li>
            </ul>
          </div>
          <div class="col-lg-3 col-md-6">
            <h6>Síguenos</h6>
            <div class="footer-social">
              <a href="${instagramLink}" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
              <a href="${tiktokLink}" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><i class="bi bi-tiktok"></i></a>
              <a href="${whatsappLink || '#'}" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>
            </div>
          </div>
        </div>
        <hr>
        <p class="text-center mb-0 small">Generation Colombia · Cohorte 12 &middot; Parchemos Travel &copy; 2026</p>
      </div>
    </footer>`;

  // Sincroniza el badge del carrito (localStorage "carrito")
  window.actualizarContadorCarrito = function actualizarContadorCarrito() {
    const el = document.getElementById("contadorCarrito");
    if (!el) return;
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    el.textContent = carrito.reduce((total, item) => total + item.cantidad, 0);
  };

  function montar() {
    const navRoot = document.getElementById("navbar-root");
    const footerRoot = document.getElementById("footer-root");
    if (navRoot) navRoot.innerHTML = navHTML;
    if (footerRoot) footerRoot.innerHTML = footerHTML;
    window.actualizarContadorCarrito();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", montar);
  } else {
    montar();
  }
})();
