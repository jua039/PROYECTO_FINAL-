(function () {
  const API_BASE = "https://bactravel-production.up.railway.app/api";

  function extractErrorMessage(data) {
    if (!data) return null;
    if (data.errors && typeof data.errors === "object") {
      const details = Object.values(data.errors).filter(Boolean);
      if (details.length) return details.join(". ");
    }
    return data.message || data.error || null;
  }

  async function apiFetch(endpoint, options = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });

    let data = null;
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (!response.ok) {
      throw new Error(extractErrorMessage(data) || `Error ${response.status}`);
    }

    if (response.status === 204) return null;
    return data;
  }

  function mapPaqueteDetalle(paquete) {
    return {
      id: paquete.paqueteId,
      paqueteId: paquete.paqueteId,
      destinoId: paquete.destinoId,
      nombre: paquete.nombre,
      region: paquete.region || "",
      descripcion: paquete.descripcion || paquete.destinoDescripcion || "",
      precio: Number(paquete.precio),
      duracion: paquete.duracionTexto || `${paquete.duracionDias} días`,
      categoria: paquete.categoria || "General",
      tipoViaje: paquete.tipoViaje || "Parche individual",
      cupos: paquete.cupoMaximo,
      imagen: paquete.imagenUrl || "../assets/images/hero.png",
      servicios: Array.isArray(paquete.servicios) ? paquete.servicios : ["Hotel", "Transporte", "Alimentación"],
    };
  }

  window.API = {
    baseUrl: API_BASE,
    apiFetch,
    mapPaqueteDetalle,

    getPaquetesDetalle: async (page = 0, size = 50) => {
      const data = await apiFetch(`/paquetes/detalle?page=${page}&size=${size}`);
      return {
        ...data,
        content: (data.content || []).map(mapPaqueteDetalle),
      };
    },

    login: (email, password) =>
      apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    register: (usuario) =>
      apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(usuario),
      }),

    crearReserva: (reserva) =>
      apiFetch("/reservas", {
        method: "POST",
        body: JSON.stringify(reserva),
      }),

    crearDestino: (destino) =>
      apiFetch("/destinos", {
        method: "POST",
        body: JSON.stringify(destino),
      }),

    actualizarDestino: (id, destino) =>
      apiFetch(`/destinos/${id}`, {
        method: "PUT",
        body: JSON.stringify(destino),
      }),

    eliminarDestino: (id) =>
      apiFetch(`/destinos/${id}`, { method: "DELETE" }),

    crearPaquete: (paquete) =>
      apiFetch("/paquetes", {
        method: "POST",
        body: JSON.stringify(paquete),
      }),

    actualizarPaquete: (id, paquete) =>
      apiFetch(`/paquetes/${id}`, {
        method: "PUT",
        body: JSON.stringify(paquete),
      }),

    eliminarPaquete: (id) =>
      apiFetch(`/paquetes/${id}`, { method: "DELETE" }),
  };
})();
