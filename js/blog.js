
const POSTS_BLOG = [
  {
    id: 1,
    titulo: "5 rutas de senderismo imperdibles en el Eje Cafetero",
    categoria: "Aventura",
    fecha: "12 jul 2026",
    imagen: "https://images.pexels.com/photos/13829249/pexels-photo-13829249.jpeg",
    resumen: "Desde el Valle de Cocora hasta los miradores de Salento, te contamos las caminatas que todo parcero debe hacer al menos una vez.",
    contenido: "El Eje Cafetero ofrece paisajes de ensueño para quienes disfrutan caminar. Entre palmas de cera, fincas cafeteras y niebla de montaña, cada sendero cuenta una historia distinta de nuestra geografía.\n\nPara comenzar, el Valle de Cocora ofrece recorridos de diferente dificultad entre palmas de cera y miradores. En Salento puedes complementar la caminata con una visita a una finca cafetera y conversar con productores locales sobre el proceso del grano.\n\nRecomendamos madrugar, llevar impermeable, protector solar, agua y calzado con buen agarre. Contratar guías locales hace el recorrido más seguro y ayuda a descubrir senderos, aves y relatos que no aparecen en un mapa.",
    destacado: true,
  },
  {
    id: 2,
    titulo: "Sabores del Caribe: la gastronomía que no te puedes perder en Cartagena",
    categoria: "Gastronomía",
    fecha: "05 jul 2026",
    imagen: "https://images.pexels.com/photos/4016193/pexels-photo-4016193.jpeg",
    resumen: "Ceviches, arepas de huevo y cocadas: un recorrido por los sabores que definen la costa colombiana.",
    contenido: "La cocina cartagenera mezcla influencias afro, indígenas y españolas. Recorrer sus calles es también un viaje de sabores: desde el pescado frito frente al mar hasta los postres de coco vendidos en las murallas.\n\nBusca los mercados locales para probar arepas de huevo, enyucados y jugos de frutas del Caribe. Al final de la tarde, una cocada o un raspao es la excusa perfecta para recorrer las plazas del centro histórico.\n\nSi tienes restricciones alimentarias, pregunta por la preparación antes de ordenar: muchos restaurantes ya ofrecen alternativas, pero los sabores tradicionales se disfrutan mejor con una recomendación de quien cocina.",
  },
  {
    id: 3,
    titulo: "La historia detrás de la Ciudad Amurallada",
    categoria: "Cultura",
    fecha: "28 jun 2026",
    imagen: "https://images.pexels.com/photos/13783816/pexels-photo-13783816.jpeg",
    resumen: "Un vistazo a los siglos de historia que convirtieron a Cartagena en Patrimonio de la Humanidad.",
    contenido: "Construida para proteger a la ciudad de ataques piratas, la muralla de Cartagena es hoy uno de los conjuntos coloniales mejor conservados de América. Sus calles guardan relatos de comercio, resistencia y cultura caribeña.",
  },
  {
    id: 4,
    titulo: "Cómo armar maleta para un viaje de 3 días por Colombia",
    categoria: "Consejos",
    fecha: "20 jun 2026",
    imagen: "https://images.pexels.com/photos/19676274/pexels-photo-19676274.jpeg",
    resumen: "Consejos prácticos para viajar liviano sin dejar nada esencial en casa.",
    contenido: "Piensa en capas de ropa, protector solar, un buen calzado cómodo y documentos digitalizados. Colombia tiene climas muy variados, así que revisa el destino antes de empacar.\n\nHaz una lista corta por categorías: documentos y dinero, ropa adaptable, cuidado personal y un pequeño botiquín. Lleva una muda adicional en el equipaje de mano si vas a tomar vuelos o trayectos largos.\n\nDeja espacio libre en la maleta para compras locales y evita cargar artículos que puedes conseguir al llegar. Viajar ligero te permite moverte con más facilidad y aprovechar más cada plan.",
  },
  {
    id: 5,
    titulo: "San Andrés: guía rápida para tu primer viaje al mar de los 7 colores",
    categoria: "Aventura",
    fecha: "10 jun 2026",
    imagen: "https://images.pexels.com/photos/3417784/pexels-photo-3417784.jpeg",
    resumen: "Qué llevar, cuándo viajar y los planes imperdibles en la isla.",
    contenido: "San Andrés es ideal para el buceo y el snorkel. La mejor época para visitarla suele ser fuera de temporada alta, cuando el clima es estable y los precios más accesibles.",
  },
  {
    id: 6,
    titulo: "Parchar en familia: 4 destinos pensados para todas las edades",
    categoria: "Consejos",
    fecha: "02 jun 2026",
    imagen: "https://images.pexels.com/photos/17025853/pexels-photo-17025853.jpeg",
    resumen: "Destinos seguros, cómodos y con actividades para grandes y chicos.",
    contenido: "Guatapé, la Catedral de Sal y el Valle de Cocora son destinos accesibles, con trayectos cortos y actividades pensadas para disfrutar en familia sin complicaciones.",
  },
];

const filtrosState = { categoria: "todos" };

function crearBadgeCategoria(categoria) {
  return `<span class="badge-categoria">${categoria}</span>`;
}

function renderizarDestacado(posts) {
  const contenedor = document.getElementById("postDestacado");
  const destacado = posts.find((p) => p.destacado) || posts[0];

  if (!destacado) {
    contenedor.innerHTML = "";
    return;
  }

  contenedor.innerHTML = `
    <div class="post-destacado">
      <img src="${destacado.imagen}" alt="${destacado.titulo}">
      <div class="post-destacado-body">
        ${crearBadgeCategoria(destacado.categoria)}
        <h2>${destacado.titulo}</h2>
        <p>${destacado.resumen}</p>
        <a href="#" class="leer-mas" data-id="${destacado.id}">Leer artículo completo <i class="bi bi-arrow-right"></i></a>
      </div>
    </div>`;
}

function crearCardBlog(post) {
  const col = document.createElement("div");
  col.className = "col-lg-4 col-md-6";
  col.innerHTML = `
    <article class="blog-card">
      <img src="${post.imagen}" alt="${post.titulo}">
      <div class="blog-card-body">
        ${crearBadgeCategoria(post.categoria)}
        <span class="blog-card-fecha">${post.fecha}</span>
        <h5>${post.titulo}</h5>
        <p>${post.resumen}</p>
        <a href="#" class="leer-mas" data-id="${post.id}">Leer más <i class="bi bi-arrow-right"></i></a>
      </div>
    </article>`;
  return col;
}

function abrirPost(id) {
  const post = POSTS_BLOG.find((p) => p.id === id);
  if (!post) return;

  let modalEl = document.getElementById("modalPost");
  if (!modalEl) {
    modalEl = document.createElement("div");
    modalEl.className = "modal fade";
    modalEl.id = "modalPost";
    modalEl.innerHTML = `
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalPostTitulo"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <img id="modalPostImagen" class="img-fluid rounded mb-3" alt="">
            <p id="modalPostContenido"></p>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modalEl);
  }

  modalEl.querySelector("#modalPostTitulo").textContent = post.titulo;
  modalEl.querySelector("#modalPostImagen").src = post.imagen;
  modalEl.querySelector("#modalPostContenido").textContent = post.contenido;

  new bootstrap.Modal(modalEl).show();
}

function renderizarBlog() {
  const lista = document.getElementById("listaBlog");
  const sinPosts = document.getElementById("sinPosts");

  const filtrados = POSTS_BLOG.filter(
    (p) => filtrosState.categoria === "todos" || p.categoria === filtrosState.categoria
  );

  renderizarDestacado(filtrados);

  const resto = filtrados.filter((p) => !p.destacado || filtrosState.categoria !== "todos");
  lista.innerHTML = "";

  if (filtrados.length === 0) {
    sinPosts.classList.remove("d-none");
    return;
  }
  sinPosts.classList.add("d-none");

  (filtrosState.categoria === "todos" ? filtrados.filter((p) => !p.destacado) : filtrados).forEach(
    (post) => lista.appendChild(crearCardBlog(post))
  );
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarBlog();

  document.querySelectorAll("#filtrosBlog .btn-filtro").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#filtrosBlog .btn-filtro").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      filtrosState.categoria = btn.dataset.categoria;
      renderizarBlog();
    });
  });

  document.addEventListener("click", (e) => {
    const link = e.target.closest(".leer-mas");
    if (!link) return;
    e.preventDefault();
    abrirPost(Number(link.dataset.id));
  });
});
