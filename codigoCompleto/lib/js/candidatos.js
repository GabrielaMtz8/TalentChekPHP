const listaCandidatosDiv = document.getElementById("listaCandidatos");
const palabrasClave = [
  "javascript", "html", "css", "react", "node", "mysql", "php", "angular", "vue", "typescript",
  "androidstudio", "kotlin", "java", "swift", "flutter", "dart", "sql", "oracle", "mongodb"
];

function asignarPuesto(texto) {
  texto = texto.toLowerCase();

  const puestos = {
    "Desarrollador Web": ["html", "css", "javascript", "react", "angular", "vue", "php", "laravel"],
    "Desarrollador Móvil": ["kotlin", "java", "swift", "flutter", "react native", "android studio"],
    "Administrador BD": ["sql", "mysql", "postgresql", "oracle", "mongodb", "firebase"],
  };

  let maxCoincidencias = 0;
  let puestoAsignado = "No asignado";

  for (const [puesto, claves] of Object.entries(puestos)) {
    const count = claves.reduce((acc, palabra) => acc + (texto.includes(palabra) ? 1 : 0), 0);
    if (count > maxCoincidencias) {
      maxCoincidencias = count;
      puestoAsignado = puesto;
    }
  }

  return puestoAsignado;
}

async function analizarPDF(pdfBase64) {
  try {
    const base64Data = pdfBase64.includes(",") ? pdfBase64.split(",")[1] : pdfBase64;

    const pdfData = atob(base64Data);
    const uint8Array = new Uint8Array(pdfData.length);
    for (let i = 0; i < pdfData.length; i++) {
      uint8Array[i] = pdfData.charCodeAt(i);
    }

    const pdf = await pdfjsLib.getDocument({data: uint8Array}).promise;

    let textoCompleto = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const textoPagina = content.items.map(item => item.str).join(" ");
      textoCompleto += textoPagina + "\n\n";
    }

    return textoCompleto.toLowerCase();
  } catch (error) {
    console.error("Error al analizar el PDF: ", error);
    return null;
  }
}

function crearCard(candidato) {
  const card = document.createElement("div");
  card.classList.add("candidato-card");

  card.innerHTML = `
    <dl>
      <dt>${candidato.nombre}</dt>
      <dd><strong>Puesto:</strong> <span class="puesto-asignado">${candidato.puesto || "No asignado"}</span></dd>
      <dd><strong>Correo:</strong> ${candidato.cue}</dd>
      <dd><strong>Teléfono:</strong> ${candidato.telefono}</dd>
    </dl>
    <button class="analyze-btn">Analizar CV</button>
    <button class="minimize-btn">Minimizar análisis</button>
    <pre class="output" style="display:none;"></pre>
  `;

  const analyzeBtn = card.querySelector(".analyze-btn");
  const minimizeBtn = card.querySelector(".minimize-btn");
  const output = card.querySelector(".output");

  analyzeBtn.addEventListener("click", async () => {
    output.style.display = "block";
    output.textContent = "Analizando PDF, espere...";

    try {
      if (!candidato.pdf_base64) {
        output.textContent = "No se encontró el PDF del candidato.";
        return;
      }

      const texto = await analizarPDF(candidato.pdf_base64);

      if (texto) {
        const puesto = asignarPuesto(texto);
        card.querySelector(".puesto-asignado").textContent = puesto;

        output.textContent = "=== Extracto del CV ===\n\n" + texto.slice(0, 1000) + "...\n\n";

        const encontradas = palabrasClave.filter(p => texto.includes(p));

        output.textContent += "=== Palabras clave encontradas ===\n" + (encontradas.length ? encontradas.join(", ") : "Ninguna") + "\n\n";

        const porcentaje = (encontradas.length / palabrasClave.length) * 100;
        output.textContent += "=== Porcentaje de adecuación ===\n" + porcentaje.toFixed(2) + "%";
      } else {
        output.textContent = "Error al analizar el PDF.";
      }
    } catch (error) {
      output.textContent = "Error al analizar el PDF: " + error.message;
    }
  });

  minimizeBtn.addEventListener("click", () => {
    if (output.style.display === "none" || output.style.display === "") {
      output.style.display = "block";
      minimizeBtn.textContent = "Minimizar análisis";
    } else {
      output.style.display = "none";
      minimizeBtn.textContent = "Mostrar análisis";
    }
  });

  return card;
}

async function cargarCandidatos() {
  try {
    const res = await fetch("lib/php/analizar_cv.php");

    const text = await res.text();
    console.log("Respuesta recibida: ", text);

    const data = JSON.parse(text);

    if (!data.success) {
      listaCandidatosDiv.innerHTML = "<p>Error al cargar candidatos: " + data.message + "</p>";
      return;
    }

    listaCandidatosDiv.innerHTML = "";

    data.candidatos.forEach(candidato => {
      const card = crearCard(candidato);
      listaCandidatosDiv.appendChild(card);
    });

  } catch (error) {
    listaCandidatosDiv.innerHTML = "<p>Error al cargar candidatos: " + error.message + "</p>";
  }
}

document.addEventListener("DOMContentLoaded", cargarCandidatos);
