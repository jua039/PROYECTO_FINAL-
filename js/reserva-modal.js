(function () {
  function asegurarModal() {
    if (document.getElementById("modalReservaConfirmada")) return;

    document.body.insertAdjacentHTML(
      "beforeend",
      `<div class="modal fade" id="modalReservaConfirmada" tabindex="-1" aria-labelledby="modalReservaTitulo" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content modal-reserva-content">
            <div class="modal-header border-0 pb-0">
              <div>
                <span class="modal-reserva-icono"><i class="bi bi-envelope-check-fill"></i></span>
                <h5 class="modal-title mt-3" id="modalReservaTitulo">Reserva registrada</h5>
              </div>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body pt-2">
              <p id="modalReservaMensaje" class="mb-3"></p>
              <div id="modalReservaEmail" class="modal-reserva-email"></div>
            </div>
            <div class="modal-footer border-0 pt-0 flex-wrap gap-2">
              <a href="#" id="modalReservaBtnCarrito" class="btn btn-reservar">Ver mis reservas</a>
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" id="modalReservaBtnCerrar">Seguir explorando</button>
            </div>
          </div>
        </div>
      </div>`,
    );
  }

  function obtenerRutaCarrito() {
    const enHtml = window.location.pathname.includes("/html/");
    return enHtml ? "carrito.html" : "html/carrito.html";
  }

  function mostrarModalReservaEmail({ titulo, destinoNombre, esConfirmacion = false } = {}) {
    asegurarModal();

    const sesion = window.Auth?.obtenerSesion?.();
    const correo = sesion?.correo;
    const tituloEl = document.getElementById("modalReservaTitulo");
    const mensajeEl = document.getElementById("modalReservaMensaje");
    const emailEl = document.getElementById("modalReservaEmail");
    const btnCarrito = document.getElementById("modalReservaBtnCarrito");
    const btnCerrar = document.getElementById("modalReservaBtnCerrar");

    tituloEl.textContent = titulo || (esConfirmacion ? "¡Reserva confirmada!" : "¡Agregado a tus reservas!");

    if (esConfirmacion) {
      mensajeEl.textContent =
        "Tu reserva fue confirmada con éxito. Muy pronto enviaremos a tu correo de contacto la información completa del viaje: itinerario, recomendaciones, estado de pago y datos de contacto de nuestro equipo.";
      btnCerrar.textContent = "Entendido";
      btnCarrito.classList.add("d-none");
    } else {
      mensajeEl.textContent = destinoNombre
        ? `"${destinoNombre}" se agregó a tus reservas. Cuando confirmes tu compra, enviaremos todos los detalles del viaje a tu correo de contacto.`
        : "El destino se agregó a tus reservas. Al confirmar la compra, enviaremos la información a tu correo de contacto.";
      btnCerrar.textContent = "Seguir explorando";
      btnCarrito.classList.remove("d-none");
    }

    btnCarrito.href = obtenerRutaCarrito();

    if (correo) {
      emailEl.innerHTML = `<i class="bi bi-envelope-at"></i> Enviaremos la información a: <strong>${correo}</strong>`;
    } else {
      emailEl.innerHTML = `<i class="bi bi-info-circle"></i> Inicia sesión o regístrate para recibir la confirmación en tu correo electrónico.`;
    }

    bootstrap.Modal.getOrCreateInstance(document.getElementById("modalReservaConfirmada")).show();
  }

  window.mostrarModalReservaEmail = mostrarModalReservaEmail;
})();
