let capitanesData = [];
let filtroActual = 'Todos';

// Cargar los datos desde datos.json al iniciar
document.addEventListener('DOMContentLoaded', () => {
  fetch('datos.json')
    .then(response => response.json())
    .then(data => {
      capitanesData = data.capitanes;
      actualizarVista();
    })
    .catch(error => console.error('Error al cargar datos.json:', error));
});

// Cambiar el filtro activo al hacer clic en un botón
function filtrarCapitanes(categoria) {
  filtroActual = categoria;

  // Actualizar clase activa en los botones
  document.querySelectorAll('.btn-filtro').forEach(btn => {
    btn.classList.remove('activo');
  });
  event.target.classList.add('activo');

  actualizarVista();
}

// Calcular las estadísticas según el rango y nivel seleccionado
function calcularStats(baseParia, rango, nivel) {
  let vMult = 1;
  let vBaseRango = 0;
  let vIncremento = 15;

  // Ajustes de Vida por Rango (según los datos validados)
  if (rango === 'Paria') {
    vBaseRango = baseParia.vida;
    vIncremento = 15;
  } else if (rango === 'Inofensivo') {
    vBaseRango = 102;
    vIncremento = 22.5;
  } else if (rango === 'Peligroso') {
    vBaseRango = 113;
    vIncremento = 33;
  }

  const vidaFinal = Math.round(vBaseRango + (nivel - 1) * vIncremento);

  // Ajustes de Reputación y Suerte (según los datos validados)
  let repMult = 1;
  let suerteMult = 1;

  if (rango === 'Inofensivo') {
    repMult = 1.55;
    suerteMult = 1.66;
  } else if (rango === 'Peligroso') {
    repMult = 2.22;
    suerteMult = 2.33;
  }

  const reputacionFinal = Math.round((baseParia.reputacion * repMult) * nivel);
  const suerteFinal = Math.round((baseParia.suerte * suerteMult) * nivel);

  return {
    vida: vidaFinal,
    reputacion: reputacionFinal,
    suerte: suerteFinal
  };
}

// Renderizar las tarjetas en la página
function actualizarVista() {
  const contenedor = document.getElementById('lista-capitanes');
  const rango = document.getElementById('select-rango').value;
  const nivel = parseInt(document.getElementById('select-nivel').value);

  contenedor.innerHTML = '';

  const filtrados = capitanesData.filter(cap => {
    if (filtroActual === 'Todos') return true;
    return cap.tipo === filtroActual;
  });

  filtrados.forEach(cap => {
    const stats = calcularStats(cap.atributosBasePariaLvl1, rango, nivel);

    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-capitan';

    tarjeta.innerHTML = `
      <div>
        <h3>${cap.nombre}</h3>
        <span class="badge-tipo">${cap.tipo}</span>
        
        <ul class="stats-list">
          <li>
            <span class="stat-label">❤️ Vitalidad:</span>
            <span class="stat-val">${stats.vida}</span>
          </li>
          <li>
            <span class="stat-label">🏆 Reputación:</span>
            <span class="stat-val">${stats.reputacion}</span>
          </li>
          <li>
            <span class="stat-label">🍀 Suerte:</span>
            <span class="stat-val">${stats.suerte}</span>
          </li>
        </ul>
      </div>

      <div class="consejo-box">
        <strong>Consejo:</strong> ${cap.usoRecomendado}
      </div>
    `;

    contenedor.appendChild(tarjeta);
  });
}
