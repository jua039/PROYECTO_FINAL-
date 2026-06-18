/* const formulario = document.getElementById('contactenos');

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombre = document.getElementById('nombreCompleto').value;
    const email = document.getElementById('agregarCorreo').value;
    const telefono = document.getElementById('numeroTelefono').value;
    const indicativo = document.getElementById('numIndicativo').value;
    const mensaje = document.getElementById('escribaMensaje').value;

    const usuario = {
        nombre,
        email,
        indicativo,
        telefono,
        mensaje
    };

    localStorage.setItem("formulario", JSON.stringify(usuario));
    console.log("Datos guardados:", usuario);
    alert("Tú comentario fue enviado correctamente");
    formulario.reset();
}); */