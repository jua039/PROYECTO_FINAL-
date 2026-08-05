(function () {
  const SESSION_KEY = "sesionActiva";

  function normalizarCorreo(correo) {
    return String(correo || "").trim().toLowerCase();
  }

  function mapearRol(rolApi) {
    return rolApi === "ADMIN" ? "admin" : "cliente";
  }

  function crearSesion(usuario, recordar) {
    const sesion = {
      usuarioId: usuario.usuarioId ?? null,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      correo: usuario.correo,
      rol: usuario.rol || "cliente",
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
      }
    }
    return null;
  }

  function esAdmin() {
    return obtenerSesion()?.rol === "admin";
  }

  function esCliente() {
    const sesion = obtenerSesion();
    return sesion && sesion.rol === "cliente";
  }

  function obtenerRutaPostLogin(sesion, baseHtml = ".") {
    if (sesion?.rol === "admin") {
      return baseHtml === ".." ? "dashboard.html" : "html/dashboard.html";
    }
    return baseHtml === ".." ? "catalogo.html" : "html/catalogo.html";
  }

  function cerrarSesion() {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("rolAdmin");
  }

  async function registrar(datos) {
    try {
      await window.API.register({
        nombre: datos.nombres.trim(),
        apellido: datos.apellidos.trim(),
        email: normalizarCorreo(datos.correo),
        password: datos.contrasena,
      });
      return { ok: true };
    } catch (error) {
      return { ok: false, mensaje: error.message || "No se pudo completar el registro." };
    }
  }

  async function iniciarSesion(correo, contrasena, recordar) {
    try {
      const respuesta = await window.API.login(normalizarCorreo(correo), contrasena);
      const sesion = crearSesion(
        {
          usuarioId: respuesta.usuarioId,
          nombres: respuesta.nombre,
          apellidos: respuesta.apellido,
          correo: respuesta.email,
          rol: mapearRol(respuesta.rol),
        },
        recordar,
      );
      return { ok: true, sesion };
    } catch (error) {
      return { ok: false, mensaje: error.message || "Correo o contraseña incorrectos." };
    }
  }

  window.Auth = {
    cerrarSesion,
    esAdmin,
    esCliente,
    iniciarSesion,
    mapearRol,
    obtenerRutaPostLogin,
    obtenerSesion,
    registrar,
  };
})();
