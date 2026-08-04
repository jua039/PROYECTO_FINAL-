const formularioRegistro = document.getElementById("formularioRegistro");
const mensajeEstado = document.getElementById("mensajeEstado");

function marcarError(input, mostrar) {
  input.classList.toggle("is-invalid", mostrar);
  const error = input.closest(".col-12, .col-md-6, .form-check")?.querySelector(".form-text-error");
  if (error) error.classList.toggle("is-visible", mostrar);
}

function mostrarMensaje(texto, tipo) {
  mensajeEstado.textContent = texto;
  mensajeEstado.className = `auth-toast is-visible ${tipo}`;
}

formularioRegistro.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombres = document.getElementById("nombres");
  const apellidos = document.getElementById("apellidos");
  const correo = document.getElementById("correo");
  const contrasena = document.getElementById("contraseña");
  const confirmarContrasena = document.getElementById("confirmarContraseña");
  const aceptaTerminos = document.getElementById("aceptaTerminos");
  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim());
  const contrasenaValida = contrasena.value.length >= 6;
  const coinciden = contrasena.value === confirmarContrasena.value && confirmarContrasena.value !== "";

  marcarError(nombres, nombres.value.trim() === "");
  marcarError(apellidos, apellidos.value.trim() === "");
  marcarError(correo, !correoValido);
  marcarError(contrasena, !contrasenaValida);
  marcarError(confirmarContrasena, !coinciden);
  marcarError(aceptaTerminos, !aceptaTerminos.checked);

  if (nombres.value.trim() === "" || apellidos.value.trim() === "" || !correoValido || !contrasenaValida || !coinciden || !aceptaTerminos.checked) {
    mostrarMensaje("Revisa los campos marcados antes de continuar.", "error");
    return;
  }

  const resultado = window.Auth.registrar({
    nombres: nombres.value,
    apellidos: apellidos.value,
    correo: correo.value,
    contrasena: contrasena.value,
  });
  if (!resultado.ok) {
    marcarError(correo, true);
    mostrarMensaje(resultado.mensaje, "error");
    return;
  }

  mostrarMensaje("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.", "success");
  formularioRegistro.reset();
  setTimeout(() => { window.location.href = "login.html"; }, 900);
});

formularioRegistro.querySelectorAll(".form-control, #aceptaTerminos").forEach((input) => {
  input.addEventListener("input", () => marcarError(input, false));
  input.addEventListener("change", () => marcarError(input, false));
});
