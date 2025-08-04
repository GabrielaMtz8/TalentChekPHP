// Respuestas correctas
const respuestasCorrectas = {
  q1: "Dart",
  q2: "Todas las anteriores",
  q3: "Manejar la navegación entre pantallas",
  q4: "AndroidManifest.xml",
  q5: "Aplica cambios al código sin reiniciar completamente la app",
  q6: "Autenticación, base de datos en tiempo real y notificaciones",
  q7: "User Interface",
  q8: "Un componente visual reutilizable",
  q9: "Firebase Cloud Messaging (FCM)",
  q10: "Reutilización del código para múltiples plataformas"
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

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      streamGlobal = stream;
      video.srcObject = stream;
      startBtn.disabled = false;
    })
    .catch((err) => {
      console.error("Error al acceder a la cámara:", err.name, err.message);
      alert("⚠️ Error al acceder a la cámara. Intenta en HTTPS o revisa permisos.");
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

// Pasar al siguiente paso
function nextStep(num) {
  const currentStep = document.getElementById(`step-${num}`);
  const inputs = currentStep.querySelectorAll('input[type="radio"]');
  const totalQuestions = new Set(Array.from(inputs).map((i) => i.name)).size;
  const checkedCount = new Set(
    Array.from(inputs).filter((i) => i.checked).map((i) => i.name)
  ).size;

  if (checkedCount < totalQuestions) {
    alert("Por favor responde todas las preguntas antes de continuar.");
    return;
  }

  currentStep.style.display = "none";
  const nextStepEl = document.getElementById(`step-${num + 1}`);
  if (nextStepEl) nextStepEl.style.display = "block";
}
window.nextStep = nextStep;

// Obtener respuestas seleccionadas
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

  // Validar que todas estén contestadas
  for (let i = 1; i <= 10; i++) {
    if (!respuestas[`q${i}`]) {
      alert(`Falta responder la pregunta ${i}`);
      return;
    }
  }

  // Calcular aciertos
  let aciertos = 0;
  for (let i = 1; i <= 10; i++) {
    if (respuestas[`q${i}`] === respuestasCorrectas[`q${i}`]) {
      aciertos++;
    }
  }

  // Enviar sin nombre, correo ni mostrar aciertos
  fetch("./lib/php/guardar_resultados.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ respuestas, aciertos, total: 10 })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        if (streamGlobal) {
          streamGlobal.getTracks().forEach((track) => track.stop());
        }

        document.querySelectorAll(".question-section").forEach((section) => {
          section.style.display = "none";
        });
        document.getElementById("final-msg").style.display = "block";
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
window.finalizarExamen = finalizarExamen;

// Botón Finalizar
document.getElementById("finalizar")?.addEventListener("click", finalizarExamen);
