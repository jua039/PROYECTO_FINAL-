
const reservasPorMes = {
  Ene: [3, 5, 2, 6, 4, 7, 3],
  Feb: [4, 2, 6, 3, 5, 2, 4],
  Mar: [6, 7, 5, 8, 6, 4, 5],
  Abr: [2, 3, 4, 2, 3, 5, 2],
  May: [5, 6, 4, 7, 5, 6, 4],
};

const dias = ["1", "2", "3", "4", "5", "6", "7"];


const chartContainer = document.getElementById("chart");

function dibujarGrafico(mes) {
  const valores = reservasPorMes[mes];
  const maximo = Math.max(...valores);

  
  chartContainer.innerHTML = "";

  valores.forEach((valor, i) => {
   
    const alturaPorcentaje = (valor / maximo) * 100;

    const columna = document.createElement("div");
    columna.className = "bar-col";

    const barra = document.createElement("div");
    barra.className = "bar";
    barra.style.height = alturaPorcentaje + "%";

    const valorTexto = document.createElement("span");
    valorTexto.className = "bar-value";
    valorTexto.textContent = dias[i];

    columna.appendChild(barra);
    columna.appendChild(valorTexto);
    chartContainer.appendChild(columna);
  });
}


dibujarGrafico("Ene");


const monthButtons = document.querySelectorAll(".month-btn");

monthButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Marcar el botón activo
    monthButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Redibujar el gráfico con los datos del mes elegido
    const mes = btn.dataset.month;
    dibujarGrafico(mes);
  });
});


const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    const section = card.dataset.section;
    // Acá podés navegar a otra página o mostrar otra sección.
    // Por ahora solo lo mostramos en consola como ejemplo:
    console.log("Abrir sección:", section);
  });
});