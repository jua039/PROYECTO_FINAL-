const formulario = document.getElementById("iniciarSesion");
const mensajeEstado = document.getElementById("mensajeEstado");
const btnSubmit = formulario?.querySelector('button[type="submit"]');

function mostrarMensaje(texto, tipo) {
  mensajeEstado.textContent = texto;
  mensajeEstado.className = `auth-toast is-visible ${tipo}`;
}

function marcarError(input, mostrar) {
  input.classList.toggle("is-invalid", mostrar);
  const error = input.parentElement.querySelector(".form-text-error");
  if (error) error.classList.toggle("is-visible", mostrar);
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const correo = document.getElementById("floatingInput");
  const contrasena = document.getElementById("floatingPassword");
  const recordar = document.getElementById("guardarInfo").checked;
  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim());
  const contrasenaValida = contrasena.value.length > 0;

  marcarError(correo, !correoValido);
  marcarError(contrasena, !contrasenaValida);
  if (!correoValido || !contrasenaValida) {
    mostrarMensaje("Completa el correo y la contraseña para continuar.", "error");
    return;
  }

  if (btnSubmit) btnSubmit.disabled = true;
  const resultado = await window.Auth.iniciarSesion(correo.value, contrasena.value, recordar);
  if (btnSubmit) btnSubmit.disabled = false;

  if (!resultado.ok) {
    mostrarMensaje(resultado.mensaje, "error");
    return;
  }

  const destino = sessionStorage.getItem("postLoginRedirect")
    || window.Auth.obtenerRutaPostLogin(resultado.sesion, "..");
  sessionStorage.removeItem("postLoginRedirect");

  const mensajeBienvenida = resultado.sesion.rol === "admin"
    ? `¡Bienvenido, ${resultado.sesion.nombres}! Redirigiendo al panel admin...`
    : `¡Hola, ${resultado.sesion.nombres}! Explora destinos y confirma tu reserva...`;

  mostrarMensaje(mensajeBienvenida, "success");
  setTimeout(() => {
    window.location.href = destino;
  }, 700);
});

formulario.querySelectorAll(".form-control").forEach((input) => {
  input.addEventListener("input", () => marcarError(input, false));
});
