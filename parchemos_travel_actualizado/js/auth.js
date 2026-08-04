/* Autenticación para la versión estática de Parchemos Travel.
   En una aplicación con servidor, las contraseñas y sesiones deben manejarse
   en el backend; aquí se persisten únicamente en el navegador del usuario. */
(function () {
  const USERS_KEY = "usuarios";
  const SESSION_KEY = "sesionActiva";
  const ADMIN = {
    nombres: "Gerencia",
    apellidos: "Parchemos Travel",
    correo: "gerencia.parchemos@admin.co",
    contrasena: "Parchemos#2026",
    rol: "admin",
  };

  function normalizarCorreo(correo) {
    return String(correo || "").trim().toLowerCase();
  }

  function obtenerUsuarios() {
    try {
      const usuarios = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      return Array.isArray(usuarios) ? usuarios : [];
    } catch {
      return [];
    }
  }

  function guardarUsuarios(usuarios) {
    localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
  }

  function crearSesion(usuario, recordar) {
    const sesion = {
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      correo: usuario.correo,
      rol: usuario.rol || "usuario",
    };
    const almacenamiento = recordar ? localStorage : sessionStorage;
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    almacenamiento.setItem(SESSION_KEY, JSON.stringify(sesion));
    localStorage.setItem("rolAdmin", sesion.rol === "admin" ? "true" : "false");
    return sesion;
  }

  function obtenerSesion() {
    for (const almacenamiento of [localStorage, sessionStorage]) {
      try {
        const sesion = JSON.parse(almacenamiento.getItem(SESSION_KEY) || "null");
        if (sesion && sesion.correo) return sesion;
      } catch {
        // Un valor corrupto no debe impedir volver a iniciar sesión.
      }
    }
    return null;
  }

  function cerrarSesion() {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("rolAdmin");
  }

  function registrar(datos) {
    const correo = normalizarCorreo(datos.correo);
    const usuarios = obtenerUsuarios();
    if (correo === ADMIN.correo || usuarios.some((usuario) => normalizarCorreo(usuario.correo) === correo)) {
      return { ok: false, mensaje: "Ya existe una cuenta registrada con ese correo." };
    }

    const usuario = {
      nombres: datos.nombres.trim(),
      apellidos: datos.apellidos.trim(),
      correo,
      contrasena: datos.contrasena,
      rol: "usuario",
    };
    usuarios.push(usuario);
    guardarUsuarios(usuarios);
    return { ok: true, usuario };
  }

  function iniciarSesion(correo, contrasena, recordar) {
    const correoNormalizado = normalizarCorreo(correo);
    let usuario = null;

    if (correoNormalizado === ADMIN.correo && contrasena === ADMIN.contrasena) {
      usuario = ADMIN;
    } else {
      usuario = obtenerUsuarios().find((candidato) =>
        normalizarCorreo(candidato.correo) === correoNormalizado &&
        // Compatibilidad con registros previos, que usaban la propiedad con ñ.
        (candidato.contrasena || candidato["contraseña"]) === contrasena
      );
    }

    if (!usuario) return { ok: false, mensaje: "Correo o contraseña incorrectos." };
    return { ok: true, sesion: crearSesion(usuario, recordar) };
  }

  window.Auth = { cerrarSesion, iniciarSesion, obtenerSesion, registrar };
})();
