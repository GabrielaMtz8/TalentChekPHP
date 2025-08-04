const respuestasCorrectas = {
    q1: "img",
    q2: "React",
    q3: "color",
    q4: "HTTP",
    q5: "Permite la comunicación entre sistemas usando HTTP",
    q6: "Facilita la alineación de elementos en un contenedor",
    q7: "Git",
    q8: "Optimizar imágenes para reducir el tiempo de carga",
    q9: "Una aplicación que se carga completamente al inicio y luego usa JavaScript para navegar",
    q10: "Guarda variables de entorno confidenciales"
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

// Pasar al siguiente paso
function nextStep(num) {
  const currentStep = document.getElementById(`step-${num}`);
  const inputs = currentStep.querySelectorAll('input[type="radio"]');
  const totalQuestions = new Set(Array.from(inputs).map((i) => i.name)).size;
  const checkedCount = new Set(
    Array.from(inputs)
      .filter((i) => i.checked)
      .map((i) => i.name)
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

  // Enviar resultados sin pedir nombre ni correo
  enviarResultadosPHP(respuestas, aciertos, 10);
}

// Enviar datos al backend
function enviarResultadosPHP(respuestas, aciertos, total) {
  fetch("./lib/php/guardar_resultados.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ respuestas, aciertos, total })  // solo estos datos
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Detener la cámara
        if (streamGlobal) {
          streamGlobal.getTracks().forEach(track => track.stop());
        }

        // Ocultar todas las secciones de preguntas
        document.querySelectorAll('.question-section').forEach(section => {
          section.style.display = 'none';
        });
        document.getElementById('final-msg').style.display = 'block';

      } 
    })
    .catch(err => {
      console.error(err);
      alert("❌ Error al conectar con el servidor.");
    });
}

// Vincular el botón Finalizar
document.getElementById("finalizar").addEventListener("click", finalizarExamen);
