let capitanesData = [];
let categoriaActual = 'Todos';

document.addEventListener('DOMContentLoaded', () => {
  fetch('datos.json')
    .then(response => response.json())
    .then(data => {
      capitanesData = data.capitanes;
      actualizarVista();
    })
    .catch(error => console.error('Error al cargar datos.json:', error));
});

function filtrarCategoria(cat) {
  categoriaActual = cat;
  document.querySelectorAll('.btn-filtro').forEach(btn => btn.classList.remove('activo'));
  event.target.classList.add('activo');
  actualizarVista();
}

function calcularStatsPorNivel(baseParia, rango, lvl) {
  let vBaseRango = baseParia.vida;
  let vInc = 15;
  let repMult = 1;
  let suerteMult = 1;

  if (rango === 'Inofensivo') {
    vBaseRango = 102;
    vInc = 22.5;
    repMult = 1.55;
    suerteMult = 1.66;
  } else if (rango === 'Peligroso') {
    vBaseRango = 113;
    vInc = 33;
    repMult = 2.22;
    suerteMult = 2.33;
  } else if (rango === 'Élite') {
    vBaseRango = 125;
    vInc = 45;
    repMult = 3.0;
    suerteMult = 3.0;
  } else if (rango === 'Épico') {
    vBaseRango = 140;
    vInc = 60;
    repMult = 4.0;
    suerteMult = 4.0;
  }

  const vida = Math.round(vBaseRango + (lvl - 1) * vInc);
  const reputacion = Math.round((baseParia.reputacion * repMult) * lvl);
  const suerte = Math.round((baseParia.suerte * suerteMult) * lvl);

  return { nivel: lvl, vida, reputacion, suerte };
}

function actualizarVista() {
  const contenedor = document.getElementById('lista-capitanes');
  const rango = document.getElementById('select-rango').value;
  const nivelResaltado = parseInt(document.getElementById('select-nivel-destacado').value);
  const atributoFiltro = document.getElementById('select-atributo').value;

  contenedor.innerHTML = '';

  const filtrados = capitanesData.filter(cap => {
    const coincideCat = (categoriaActual === 'Todos' || cap.tipo === categoriaActual);
    const coincideAtributo = (atributoFiltro === 'Todos' || cap.atributosFuertes.includes(atributoFiltro));
    return coincideCat && coincideAtributo;
  });

  filtrados.forEach(cap => {
    // Generar datos para los 10 niveles
    const tablaNiveles = [];
    for (let i = 1; i <= 10; i++) {
      tablaNiveles.push(calcularStatsPorNivel(cap.atributosBasePariaLvl1, rango, i));
    }

    const statsActuales = tablaNiveles[nivelResaltado - 1];

    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-capitan-vertical';

    let filasTablaHTML = '';
    tablaNiveles.forEach(row => {
      const esDestacado = row.nivel === nivelResaltado ? 'class="fila-resaltada"' : '';
      filasTablaHTML += `
        <tr ${esDestacado}>
          <td>Nivel ${row.nivel}</td>
          <td>${row.reputacion}</td>
          <td>${row.suerte}</td>
          <td>${row.vida}</td>
        </tr>
      `;
    });

    tarjeta.innerHTML = `
      <div class="header-capitan">
        <div>
          <h3>${cap.nombre}</h3>
          <span class="badge-tipo">${cap.tipo}</span>
        </div>
        <div class="resumen-rapido">
          <span><strong>Valores Nivel ${nivelResaltado} (${rango}):</strong></span>
          <span>🏆 Reputación: <strong>${statsActuales.reputacion}</strong></span> | 
          <span>🍀 Suerte: <strong>${statsActuales.suerte}</strong></span> | 
          <span>❤️ Vida: <strong>${statsActuales.vida}</strong></span>
        </div>
      </div>

      <!-- Tabla Estilo Hoja de Cálculo -->
      <div class="contenedor-tabla">
        <table class="tabla-progresion">
          <thead>
            <tr>
              <th>Nivel</th>
              <th>Reputación</th>
              <th>Suerte</th>
              <th>Vitalidad</th>
            </tr>
          </thead>
          <tbody>
            ${filasTablaHTML}
          </tbody>
        </table>
      </div>

      <div class="consejo-box">
        <strong>💡 Consejo estratégico:</strong> ${cap.usoRecomendado}
      </div>
    `;

    contenedor.appendChild(tarjeta);
  });
}
