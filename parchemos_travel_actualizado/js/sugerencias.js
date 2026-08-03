/* ============================================================
   sugerencias.js — Formulario de Sugerencias
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const mensajeEl = document.getElementById("mensajeSugerencia");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    if (!nombre || !correo || !mensaje) {
      mensajeEl.className = "alert alert-danger mt-3";
      mensajeEl.textContent = "Por favor completa todos los campos antes de enviar.";
      mensajeEl.classList.remove("d-none");
      return;
    }

    const sugerencias = JSON.parse(localStorage.getItem("sugerencias")) || [];
    sugerencias.push({ nombre, correo, mensaje, fecha: new Date().toISOString() });
    localStorage.setItem("sugerencias", JSON.stringify(sugerencias));

    mensajeEl.className = "alert alert-success mt-3";
    mensajeEl.textContent = `¡Gracias por tu sugerencia, ${nombre}! La tendremos en cuenta.`;
    mensajeEl.classList.remove("d-none");

    form.reset();
    setTimeout(() => mensajeEl.classList.add("d-none"), 5000);
  });
});
