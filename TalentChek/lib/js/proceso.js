import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_I3bIIk0nfGvuDSK0nZ_JcI7ywTP_Rd8",
  authDomain: "talentchek-t.firebaseapp.com",
  projectId: "talentchek-t",
  databaseURL: "https://talentchek-t-default-rtdb.firebaseio.com",
  storageBucket: "talentchek-t.appspot.com",
  messagingSenderId: "546382065526",
  appId: "1:546382065526:web:249deb0e90ff9b358bd457",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

function updateUI(proceso) {
  const pasos = [
    { key: "cv", elemId: "paso-cv", labelId: "estado-cv" },
    {
      key: "examen_conocimiento",
      elemId: "paso-examen-conocimiento",
      labelId: "estado-examen-conocimiento",
    },
    {
      key: "examen_psicometrico",
      elemId: "paso-examen-psicometrico",
      labelId: "estado-examen-psicometrico",
    },
    {
      key: "entrevista",
      elemId: "paso-entrevista",
      labelId: "estado-entrevista",
    },
  ];

  let progreso = 0;

  pasos.forEach((paso) => {
    const estadoRaw = proceso[paso.key] || "pendiente";
    const estado = estadoRaw.toLowerCase();

    const el = document.getElementById(paso.elemId);
    const label = document.getElementById(paso.labelId);

    el.classList.remove("completed", "current", "upcoming");

    label.textContent = estado.charAt(0).toUpperCase() + estado.slice(1);

    if (estado === "completado") {
      el.classList.add("completed");
      progreso += 25;
    } else if (estado === "en proceso") {
      el.classList.add("current");
    } else {
      el.classList.add("upcoming");
    }
  });

  document.getElementById("barra-progreso").style.width = progreso + "%";
}

const userIcon = document.getElementById("userIcon");
const dropdownMenu = document.getElementById("dropdownMenu");

userIcon.addEventListener("click", () => {
  dropdownMenu.style.display =
    dropdownMenu.style.display === "block" ? "none" : "block";
});

window.addEventListener("click", (e) => {
  if (
    dropdownMenu.style.display === "block" &&
    !dropdownMenu.contains(e.target) &&
    e.target !== userIcon
  ) {
    dropdownMenu.style.display = "none";
  }
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // Sin alerta, solo redirige
    window.location.href = "inicioSesion.html";
    return;
  }

  const procesoRef = ref(db, `candidatos/${user.uid}/proceso`);

  try {
    const snap = await get(procesoRef);

    if (!snap.exists()) {
      await set(procesoRef, {
        cv: "pendiente",
        examen_conocimiento: "pendiente",
        examen_psicometrico: "pendiente",
        entrevista: "pendiente",
      });
    }

    onValue(procesoRef, (snapshot) => {
      if (snapshot.exists()) {
        updateUI(snapshot.val());
      }
    });
  } catch (error) {
    console.error("Error leyendo o inicializando proceso:", error);
  }
});

// Cerrar sesión
logoutBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const confirmar = confirm("¿Estás seguro que deseas cerrar sesión?");
  if (!confirmar) return;

  try {
    await signOut(auth);
    window.location.href = "inicioSesion.html"; // Redirige sin mostrar mensaje
  } catch (error) {
    alert("Error al cerrar sesión: " + error.message);
  }
});
