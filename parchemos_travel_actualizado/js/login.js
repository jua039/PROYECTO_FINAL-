const formulario = document.getElementById('iniciarSesion');
const mensajeEstado = document.getElementById('mensajeEstado');

function mostrarMensaje(texto, tipo) {
    mensajeEstado.textContent = texto;
    mensajeEstado.className = `auth-toast is-visible ${tipo}`;
}

function manejarRespuestaGoogle(respuesta) {
    const datosUsuario = JSON.parse(atob(respuesta.credential.split('.')[1]));
    console.log("Usuario verificado", datosUsuario);

    const usuario = {
        correo: datosUsuario.email,
        nombre: datosUsuario.name,
        foto: datosUsuario.picture,
        metodo: "google",
    };

    localStorage.setItem('formulario', JSON.stringify(usuario));
    mostrarMensaje(`¡Bienvenido, ${datosUsuario.name}!`, 'success');
}

formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const email = document.getElementById('floatingInput').value;
    const contraseña = document.getElementById('floatingPassword').value;
    const recordar = document.getElementById('guardarInfo').checked;

    if (email === "admin@correo.com" && contraseña === "123456") {
        mostrarMensaje('¡Bienvenido! Redirigiendo...', 'success');

        if (recordar) {
            const usuario = {
                correo: email,
                contraseña: contraseña,
                checked: recordar,
            };

            localStorage.setItem('formulario', JSON.stringify(usuario));
            console.log("Datos guardados en localStorage", usuario);
        }
    } else {
        mostrarMensaje('Usuario o contraseña incorrecta.', 'error');
    }
});