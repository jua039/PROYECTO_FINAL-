/* ============================================================
   contactenos.js — Formulario de contacto
   Guarda el último mensaje en localStorage y confirma el envío
   sin recargar la página.
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formContacto");
  const mensajeEl = document.getElementById("mensajeContacto");
  if (!formulario) return;

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const datos = {
      nombre: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      telefono: document.getElementById("number").value.trim(),
      mensaje: document.getElementById("message").value.trim(),
      fecha: new Date().toISOString(),
    };

    localStorage.setItem("ultimoMensajeContacto", JSON.stringify(datos));

    mensajeEl.textContent = `¡Gracias, ${datos.nombre || "parcero"}! Recibimos tu mensaje y te responderemos pronto.`;
    mensajeEl.classList.remove("d-none");

    formulario.reset();

    setTimeout(() => mensajeEl.classList.add("d-none"), 5000);
  });
});
