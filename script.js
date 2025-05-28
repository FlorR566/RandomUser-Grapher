'use strict';

const themeToggleButton = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');
const dayMode = document.getElementById('day-mode');
const moonMode = document.getElementById('moon-mode');
const female = [];
const men = [];
const dataList = document.getElementById('dataList');
const btnOpen = document.getElementById('getChart');
const btnClose = document.getElementById('closeChart');
const btnRefresh = document.getElementById('btnRefresh');
const canvas = document.getElementById('myChart');
let myChart;
const openButton = document.getElementById('openDialog');
const dialog = document.getElementById('myDialog');

// Función para actualizar los iconos
function updateIcons(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    moonMode.classList.remove('hidden');
    dayMode.classList.add('hidden');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    dayMode.classList.remove('hidden');
    moonMode.classList.add('hidden');
  }
}

// Aplicar el tema almacenado si existe
if (currentTheme) {
  updateIcons(currentTheme);
} else {
  // Detectamos preferencias del usuario solo si no hay tema guardado
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    updateIcons('dark');
  } else {
    updateIcons('light');
  }
}

// **Evento de click en el botón**
themeToggleButton.addEventListener('click', () => {
  let theme = document.documentElement.getAttribute('data-theme');
  let newTheme = theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', newTheme);
  updateIcons(newTheme);
});

// Función para crear el gráfico
const NewChart = function () {
  if (myChart) myChart.destroy(); // Asegurarse de no crear múltiples instancias

  myChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['Female', 'Men'],
      datasets: [
        {
          label: 'Gender Distribution in API',
          data: [female.length, men.length],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
          ],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
          borderWidth: 2,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

// Obtener datos
document.getElementById('fetchData').addEventListener('click', async () => {
  dataList.innerHTML = '<li>Cargando...</li>';

  try {
    const response = await fetch('https://randomuser.me/api/');
    const data = await response.json();

    dataList.innerHTML = '';
    getTarjeta(data.results[0]);
  } catch (error) {
    dataList.innerHTML = '<li>Error al obtener los datos</li>';
    console.log(error);
  }
});

// Crear tarjeta del usuario
const getTarjeta = function (user) {
  const listItem = document.createElement('li');
  listItem.classList.add('data-item');

  listItem.innerHTML = `
      <img class="imgPerson" src="${user.picture.large}" />
      <div class="listContainer">
      <p> <strong>Name:</strong> ${user.name.title} ${user.name.first} ${user.name.last}</p>
      <p><strong>País:</strong> ${user.location.country}</p>
      <p> <strong>Email:</strong> ${user.email} </p>
      </div>`;

  dataList.appendChild(listItem);
  user.gender === 'female' ? female.push('female') : men.push('men');

  console.log(female, men);
};

// **Evento para abrir el gráfico**
btnOpen.addEventListener('click', function () {
  btnOpen.classList.add('hidden');
  btnRefresh.classList.remove('hidden');
  btnClose.classList.remove('hidden');
  canvas.classList.remove('hidden');

  NewChart();
});

// **Evento para cerrar el gráfico**
btnClose.addEventListener('click', function () {
  if (myChart) {
    myChart.destroy(); // Destruir el gráfico antes de ocultarlo
    myChart = null; // Resetear la variable
  }
  canvas.classList.add('hidden');
  btnClose.classList.add('hidden');
  btnRefresh.classList.add('hidden');
  btnOpen.classList.remove('hidden');
});

// **Evento para refrescar el gráfico**
btnRefresh.addEventListener('click', function () {
  NewChart();
});

/* // **Evento para abrir el diálogo**
openButton.addEventListener('click', () => {
  dialog.showModal(); // Muestra el modal en el centro de la pantalla
});

// Opcional: Cerrar el modal diálogo si se hace clic fuera de él
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    dialog.close();
  }
});
*/
