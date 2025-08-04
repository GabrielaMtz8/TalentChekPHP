// Respuestas correctas
const respuestasCorrectas = {
  q1: "MySQL",
  q2: "SELECT",
  q3: "NoSQL",
  q4: "Reducir el tiempo de respuesta de las consultas",
  q5: "Atomicidad, Consistencia, Aislamiento, Durabilidad",
  q6: "Automatizar los respaldos diarios",
  q7: "SQL",
  q8: "Grafana",
  q9: "Reducir la redundancia de datos",
  q10: "MongoDB"
};

let streamGlobal = null;

// Activar cámara
function activarCamara() {
  const video = document.getElementById("video");
  const startBtn = document.getElementById("startBtn");

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Tu navegador no soporta acceso a la cámara.");
    return;
  }

  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      streamGlobal = stream;
      video.srcObject = stream;
      startBtn.disabled = false;
    })
    .catch((err) => {
      console.error("Error al acceder a la cámara:", err);
      alert("⚠️ Error al acceder a la cámara. Permite el acceso y usa HTTPS si es posible.");
    });
}
window.activarCamara = activarCamara;

// Iniciar evaluación
function startEvaluation() {
  document.getElementById("intro").style.display = "none";
  document.getElementById("step-1").style.display = "block";
}
window.startEvaluation = startEvaluation;

// Pasar al siguiente paso
function nextStep(num) {
  const current = document.getElementById(`step-${num}`);
  const inputs = current.querySelectorAll('input[type="radio"]');
  const total = new Set(Array.from(inputs).map(i => i.name)).size;
  const checked = new Set(Array.from(inputs).filter(i => i.checked).map(i => i.name)).size;

  if (checked < total) {
    alert("Responde todas las preguntas antes de continuar.");
    return;
  }

  current.style.display = "none";
  const next = document.getElementById(`step-${num + 1}`);
  if (next) next.style.display = "block";
}
window.nextStep = nextStep;

// Obtener respuestas
function obtenerRespuestas() {
  const respuestas = {};
  for (let i = 1; i <= 10; i++) {
    const opciones = document.getElementsByName(`q${i}`);
    for (const opcion of opciones) {
      if (opcion.checked) {
        respuestas[`q${i}`] = opcion.value;
        break;
      }
    }
  }
  return respuestas;
}

// Finalizar examen
function finalizarExamen() {
  const respuestas = obtenerRespuestas();

  for (let i = 1; i <= 10; i++) {
    if (!respuestas[`q${i}`]) {
      alert(`Falta responder la pregunta ${i}`);
      return;
    }
  }

  let aciertos = 0;
  for (let i = 1; i <= 10; i++) {
    if (respuestas[`q${i}`] === respuestasCorrectas[`q${i}`]) {
      aciertos++;
    }
  }

  // Enviar resultados sin nombre/correo ni mostrar aciertos
  fetch("./lib/php/guardar_resultados.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ respuestas, aciertos, total: 10 })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        if (streamGlobal) {
          streamGlobal.getTracks().forEach(track => track.stop());
        }

        document.querySelectorAll(".question-section").forEach(el => {
          el.style.display = "none";
        });
        document.getElementById("final-msg").style.display = "block";
      }
    })
    .catch(err => {
      console.error(err);
    });
}
window.finalizarExamen = finalizarExamen;
