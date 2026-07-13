const formulario = document.getElementById("registroForm");

formulario.addEventListener("submit", function(e){

    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmarPassword = document.getElementById("confirmarPassword").value;

    let valido = true;

    if(nombre ===""){

        alert("Debe ingresar el nombre completo.");
        valido = false;
        }

    if(telefono ===""){
        alert("Debe ingresar el número de teléfono.");
        valido = false;
        }

    if(email ===""){
        alert("Debe ingresar el correo electronico");
        valido = false;
    }

    if(password ===""){
        alert("Debe ingrear una contraseña");
        valido = false;

    }

    if(confirmarPassword ===""){
        alert("Debe confirmar la contraseña");
        valido = false;
    }

    const telefonoRegex = /^[0-9]{10}$/;

    if (!telefonoRegex.test(telefono)){

        alert("El telefono debe contener exactamente 10 números.");
        valido = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){

        alert("Ingrese un correo valido.");
        valido = false;
    }

    if (password.length < 8){
        alert("La contraseña debe tener minimo 8 caracteres.");
        valido = false;
    }

    if ( password !== confirmarPassword){
        alert("las contraseñas no coinciden.");
        valido = false;
    }

    if(valido){
  
    const usuario = {

    nombre:nombre,
    telefono: telefono,
    email: email,
    contraseña: contraseña
};


console.log(usuario);

localStorage.setItem("usuario", JSON.stringify(usuario));
alert("Usuario registrado correctamente");

window.location.href = "login.html";

}

});