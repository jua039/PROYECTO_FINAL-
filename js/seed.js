const DESTINOS_SEED = [
  {
    id: 1,
    nombre: "Caño Cristales",
    region: "La Macarena, Meta",
    descripcion: "Conocido como 'el río de los cinco colores', sus aguas cristalinas se tiñen de rojo, amarillo, verde, azul y negro gracias a una planta acuática endémica. Un fenómeno natural único en el mundo.",
    precio: 850000,
    duracion: "3 días / 2 noches",
    categoria: "Naturaleza",
    cupos: 15,
    imagen: "img/cano-cristales.jpg",
    },
  {
  
    id: 2,
    nombre: "Ciudad Amurallada",
    region: "Cartagena, Bolívar",
    descripcion: "Centro histórico declarado Patrimonio de la Humanidad por la UNESCO. Calles coloniales, balcones floridos, murallas frente al mar Caribe y una vibrante vida cultural hacen de este destino una joya imperdible.",
    precio: 420000,
    duracion: "2 días / 1 noche",
    categoria: "Cultural",
    cupos: 30,
    imagen: "img/cartagena.jpg",
  },
  {
    id: 3,
    nombre: "Valle de Cocora",
    region: "Salento, Quindío",
    descripcion: "Hogar de la palma de cera, árbol nacional de Colombia y la palmera más alta del mundo. Rodeado de montañas verdes y niebla, es ideal para senderismo en pleno corazón del Eje Cafetero.",
    precio: 280000,
    duracion: "1 día (full day)",
    categoria: "Montaña",
    cupos: 25,
    imagen: "img/cocora.jpg",
  },
  {
    id: 4,
    nombre: "Parque Tayrona",
    region: "Santa Marta, Magdalena",
    descripcion: "Playas de arena blanca enmarcadas por la selva tropical y la Sierra Nevada. Caminatas ecológicas, aguas turquesas y biodiversidad excepcional en uno de los parques naturales más visitados del país.",
    precio: 390000,
    duracion: "3 días / 2 noches",
    categoria: "Playa",
    cupos: 20,
    imagen: "img/tayrona.jpg",
  },
  {
    id: 5,
    nombre: "Guatapé",
    region: "Guatapé, Antioquia",
    descripcion: "Pueblo de casas coloridas con zócalos pintados a mano, junto al embalse de Guatapé. Subida a la Piedra del Peñol con vistas panorámicas y paseos en lancha por el lago.",
    precio: 310000,
    duracion: "2 días / 1 noche",
    categoria: "Rural",
    cupos: 22,
    imagen: "img/guatape.jpg",
  },
];

function inicializarSeed() {
  const datosExistentes = localStorage.getItem("destinos");

  if (!datosExistentes) {
    localStorage.setItem("destinos", JSON.stringify(DESTINOS_SEED));
    console.log("✅ Seed inicial cargado con 5 destinos de Colombia.");
  }
}

inicializarSeed();