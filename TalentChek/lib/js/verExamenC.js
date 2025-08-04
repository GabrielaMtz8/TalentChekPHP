document.addEventListener('DOMContentLoaded', () => {
  fetch('lib/php/verExamen.php')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('candidatosContainer');
      if (data.length === 0) {
        container.innerHTML = "<p style='text-align: center;'>No hay resultados disponibles.</p>";
        return;
      }

      data.forEach(row => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
          <div class="card-header" onclick="toggleCard(this)">
            <span>${escapeHtml(row.nombre)}</span>
            <i class="fas fa-chevron-down rotate"></i>
          </div>
          <div class="card-content">
            <p><strong>Puesto:</strong> ${escapeHtml(row.puesto || 'No especificado')}</p>
            <p><strong>Correo:</strong> ${escapeHtml(row.cue)}</p>
            <p><strong>Fecha:</strong> ${escapeHtml(row.fecha)}</p>
            <p><strong>Aciertos:</strong> ${escapeHtml(row.aciertos_totales)}</p>
            <p><strong>Respuestas:</strong></p>
            <ul>
              ${[...Array(10).keys()].map(i => `<li><strong>q${i+1}:</strong> ${escapeHtml(row[`q${i+1}`])}</li>`).join('')}
            </ul>
          </div>
        `;

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Error cargando datos:', err);
      document.getElementById('candidatosContainer').innerHTML = "<p style='text-align: center; color: red;'>Error al cargar los datos.</p>";
    });
});

// Función para evitar inyección HTML básica
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function toggleCard(element) {
  const content = element.nextElementSibling;
  const icon = element.querySelector('i');
  if (content.style.display === "block") {
    content.style.display = "none";
    icon.classList.remove('open');
  } else {
    content.style.display = "block";
    icon.classList.add('open');
  }
}
