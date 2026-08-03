const formularioRegistro = document.getElementById('formularioRegistro');
const mensajeEstado = document.getElementById('mensajeEstado');

function marcarError(input, mostrar) {
    input.classList.toggle('is-invalid', mostrar);
    const error = input.closest('.col-12, .col-md-6, .col-md-4, .form-check')
        ?.querySelector('.form-text-error');
    if (error) error.classList.toggle('is-visible', mostrar);
}

function mostrarMensaje(texto, tipo) {
    mensajeEstado.textContent = texto;
    mensajeEstado.className = `auth-toast is-visible ${tipo}`;
}

formularioRegistro.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const nombres = document.getElementById('nombres');
    const apellidos = document.getElementById('apellidos');
    const correo = document.getElementById('correo');
    const contraseña = document.getElementById('contraseña');
    const confirmarContraseña = document.getElementById('confirmarContraseña');
    const aceptaTerminos = document.getElementById('aceptaTerminos');

    let esValido = true;

    marcarError(nombres, nombres.value.trim() === '');
    if (nombres.value.trim() === '') esValido = false;

    marcarError(apellidos, apellidos.value.trim() === '');
    if (apellidos.value.trim() === '') esValido = false;

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim());
    marcarError(correo, !correoValido);
    if (!correoValido) esValido = false;

    const contraseñaValida = contraseña.value.length >= 6;
    marcarError(contraseña, !contraseñaValida);
    if (!contraseñaValida) esValido = false;

    const coinciden = confirmarContraseña.value === contraseña.value && confirmarContraseña.value !== '';
    marcarError(confirmarContraseña, !coinciden);
    if (!coinciden) esValido = false;

    // Términos y condiciones
    marcarError(aceptaTerminos, !aceptaTerminos.checked);
    if (!aceptaTerminos.checked) esValido = false;

    if (!esValido) {
        mostrarMensaje('Revisa todos los campos antes de continuar.', 'error');
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const yaExiste = usuarios.some(u => u.correo.toLowerCase() === correo.value.trim().toLowerCase());

    if (yaExiste) {
        marcarError(correo, true);
        mostrarMensaje('Ya existe una cuenta registrada con ese correo.', 'error');
        return;
    }

    const nuevoUsuario = {
        nombres: nombres.value.trim(),
        apellidos: apellidos.value.trim(),
        correo: correo.value.trim(),
        contraseña: contraseña.value,
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    mostrarMensaje('¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...', 'success');
    formularioRegistro.reset();

    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
});

formularioRegistro.querySelectorAll('.form-control, #aceptaTerminos').forEach(input => {
    input.addEventListener('input', () => marcarError(input, false));
});