const formulario = document.getElementById("iniciarSesion");
const mensajeEstado = document.getElementById("mensajeEstado");

function mostrarMensaje(texto, tipo) {
  mensajeEstado.textContent = texto;
  mensajeEstado.className = `auth-toast is-visible ${tipo}`;
}

function marcarError(input, mostrar) {
  input.classList.toggle("is-invalid", mostrar);
  const error = input.parentElement.querySelector(".form-text-error");
  if (error) error.classList.toggle("is-visible", mostrar);
}

formulario.addEventListener("submit", (evento) => {
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

  const resultado = window.Auth.iniciarSesion(correo.value, contrasena.value, recordar);
  if (!resultado.ok) {
    mostrarMensaje(resultado.mensaje, "error");
    return;
  }

  mostrarMensaje(`¡Bienvenido, ${resultado.sesion.nombres}! Redirigiendo al dashboard...`, "success");
  setTimeout(() => { window.location.href = "dashboard.html"; }, 700);
});

formulario.querySelectorAll(".form-control").forEach((input) => {
  input.addEventListener("input", () => marcarError(input, false));
});
