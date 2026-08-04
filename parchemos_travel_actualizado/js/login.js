const formulario = document.getElementById('iniciarSesion');
const mensajeEstado = document.getElementById('mensajeEstado');

// Credenciales exclusivas del administrador.
// Solo con este correo y esta contraseña se habilita el engranaje del panel.
const ADMIN_CORREO = "gerencia.parchemos@admin.co";
const ADMIN_CLAVE = "Parchemos#2026";

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

    // El login con Google nunca otorga el rol de administrador.
    localStorage.removeItem('rolAdmin');
    localStorage.setItem('formulario', JSON.stringify(usuario));
    mostrarMensaje(`¡Bienvenido, ${datosUsuario.name}!`, 'success');
}

formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const email = document.getElementById('floatingInput').value.trim();
    const contraseña = document.getElementById('floatingPassword').value;
    const recordar = document.getElementById('guardarInfo').checked;

    // 1. ¿Coincide con las credenciales del administrador?
    if (email.toLowerCase() === ADMIN_CORREO.toLowerCase() && contraseña === ADMIN_CLAVE) {
        localStorage.setItem('rolAdmin', 'true');

        if (recordar) {
            localStorage.setItem('formulario', JSON.stringify({ correo: email, checked: recordar }));
        }

        mostrarMensaje('¡Bienvenido, administrador! Redirigiendo...', 'success');
        setTimeout(() => { window.location.href = '../index.html'; }, 1200);
        return;
    }

    // 2. ¿Es un usuario normal ya registrado? (nunca activa el rol de administrador)
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioValido = usuarios.find(
        (u) => u.correo.toLowerCase() === email.toLowerCase() && u.contraseña === contraseña
    );

    if (usuarioValido) {
        localStorage.removeItem('rolAdmin');

        if (recordar) {
            localStorage.setItem('formulario', JSON.stringify({ correo: email, checked: recordar }));
        }

        mostrarMensaje(`¡Bienvenido, ${usuarioValido.nombres}!`, 'success');
        setTimeout(() => { window.location.href = '../index.html'; }, 1200);
        return;
    }

    // 3. Nada coincide
    mostrarMensaje('Usuario o contraseña incorrecta.', 'error');
});