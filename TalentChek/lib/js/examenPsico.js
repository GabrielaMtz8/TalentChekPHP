const respuestasCorrectas = {
  p1: "Dinero",
  p2: "Escucho y reflexiono",
  p3: "Pido ayuda",
  p4: "Las acepto y mejoro",
  p5: "Planifico con anticipación",
  p6: "Busco soluciones",
  p7: "Me adapto rápidamente"
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
      console.log("Cámara activada y botón habilitado");
    })
    .catch((err) => {
      console.error("Error al acceder a la cámara:", err.name, err.message);
      if (err.name === "NotAllowedError") {
        alert("⚠️ Debes permitir acceso a la cámara en los permisos del navegador.");
      } else if (err.name === "NotFoundError") {
        alert("⚠️ No se encontró ninguna cámara conectada.");
      } else {
        alert("⚠️ Error al acceder a la cámara. Intenta en HTTPS o revisa permisos.");
      }
      startBtn.disabled = true;
    });
}
window.activarCamara = activarCamara;

// Iniciar evaluación
function startEvaluation() {
  document.getElementById("intro").style.display = "none";
  document.getElementById("step-1").style.display = "block";
}
window.startEvaluation = startEvaluation;

// Paso siguiente
function nextStep(num) {
  const currentStep = document.getElementById(`step-${num}`);
  const inputs = currentStep.querySelectorAll('input[type="radio"]');

  const nombresPreguntas = [...new Set(Array.from(inputs).map(i => i.name))];

  for (const nombre of nombresPreguntas) {
    const checked = Array.from(inputs).some(i => i.name === nombre && i.checked);
    if (!checked) {
      alert("Por favor responde todas las preguntas antes de continuar.");
      return;
    }
  }

  currentStep.style.display = "none";
  const nextStepEl = document.getElementById(`step-${num + 1}`);
  if (nextStepEl) nextStepEl.style.display = "block";
}
window.nextStep = nextStep;

// Obtener respuestas
function obtenerRespuestas() {
  const respuestas = {};
  for (let i = 1; i <= 7; i++) {
    const opciones = document.getElementsByName(`p${i}`);
    for (const opcion of opciones) {
      if (opcion.checked) {
        respuestas[`p${i}`] = opcion.value;
        break;
      }
    }
  }
  return respuestas;
}

// Finalizar examen
function finalizarExamen() {
  const respuestas = obtenerRespuestas();

  for (let i = 1; i <= 7; i++) {
    if (!respuestas[`p${i}`]) {
      alert(`Falta responder la pregunta ${i}`);
      return;
    }
  }

  let aciertos = 0;
  for (let i = 1; i <= 7; i++) {
    if (respuestas[`p${i}`] === respuestasCorrectas[`p${i}`]) {
      aciertos++;
    }
  }

  // Enviar sin nombre/correo
  enviarResultadosPHP(respuestas, aciertos, 7);
}
window.finalizarExamen = finalizarExamen;

// Enviar al backend
function enviarResultadosPHP(respuestas, aciertos, total) {
  fetch("./lib/php/guardar_resultados_psi.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ respuestas, aciertos, total })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        if (streamGlobal) {
          streamGlobal.getTracks().forEach(track => track.stop());
        }
        document.querySelectorAll('.question-section').forEach(s => s.style.display = 'none');
        document.getElementById('final-msg').style.display = 'block';
      }
    })
    .catch(err => {
      console.error("Error al guardar:", err);
    });
}

// Listeners
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("activarCamara").addEventListener("click", activarCamara);
  document.getElementById("finalizar").addEventListener("click", finalizarExamen);
});
