const formulario = document.getElementById('iniciarSesion');
const email = document.getElementById('agregarEmail').value;
const contraseña = document.getElementById('agregarContraseña').value;
const recordar = document.getElementById('guardarInfo').checked;

formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();
    if (email === "admin@correo.com" && password === "123456") {
        alert("¡Bienvenido!");
    } else {
        alert("Usuario o contraseña incorrecta");
    }
});

const usuario = {
        correo: document.getElementById('email').value,
        contraseña: document.getElementById('contraseña').value,
        checked: document.getElementById('recordar').checked,
    };
 
localStorage.setItem('formulario', JSON.stringify(usuario));
console.log("Datos guardados en localStorage", usuario);
    alert("Usuario guardado correctamente");