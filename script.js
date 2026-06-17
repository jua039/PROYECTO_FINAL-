
const reservasPorMes = {
  Ene: [3, 5, 2, 6, 4, 7, 3],
  Feb: [4, 2, 6, 3, 5, 2, 4],
  Mar: [6, 7, 5, 8, 6, 4, 5],
  Abr: [2, 3, 4, 2, 3, 5, 2],
  May: [5, 6, 4, 7, 5, 6, 4],
};

const dias = ["1", "2", "3", "4", "5", "6", "7"];

const ctx = document.getElementById("chart");

const chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: dias,
    datasets: [
      {
        label: "Reservas",
        data: reservasPorMes["Ene"],
        backgroundColor: "#b9b9b9",
        borderRadius: 4,
        maxBarThickness: 22,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#e0e0e0" },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(255,255,255,0.08)" },
        ticks: { color: "#e0e0e0" },
      },
    },
  },
});


const monthButtons = document.querySelectorAll(".month-btn");

monthButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Marcar el botón activo
    monthButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const mes = btn.dataset.month;
    chart.data.datasets[0].data = reservasPorMes[mes];
    chart.update();
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