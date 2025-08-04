import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_I3bIIk0nfGvuDSK0nZ_JcI7ywTP_Rd8",
  authDomain: "talentchek-t.firebaseapp.com",
  projectId: "talentchek-t",
  storageBucket: "talentchek-t.appspot.com",
  messagingSenderId: "546382065526",
  appId: "1:546382065526:web:249deb0e90ff9b358bd457",
  measurementId: "G-WCG5D1N4ZJ",
  databaseURL: "https://talentchek-t-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});

window.toggleMenu = function () {
  const dropdown = document.getElementById("dropdownMenu");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
};

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        signOut(auth)
          .then(() => (window.location.href = "inicioSesion.html"))
          .catch((error) => alert("Ocurrió un error al cerrar sesión."));
      }
    });
  }

  // Cargar candidatos
  const candidatosRef = ref(db, "candidatos");
  const container = document.getElementById("candidatosContainer");

  onValue(candidatosRef, (snapshot) => {
    container.innerHTML = ""; // Limpiar antes de insertar
    snapshot.forEach((childSnapshot) => {
      const candidato = childSnapshot.val();
      const nombre = candidato.nombre || "Sin nombre";
      const proceso = candidato.proceso || {};

      const card = document.createElement("div");
      card.className = "candidato-card";

      card.innerHTML = `
          <h3>${nombre}</h3>
          <div class="candidato-proceso">
            <span><strong>CV:</strong> ${proceso.cv || "No disponible"}</span>
            <span><strong>Entrevista:</strong> ${
              proceso.entrevista || "No disponible"
            }</span>
            <span><strong>Examen de Conocimiento:</strong> ${
              proceso.examen_conocimiento || "No disponible"
            }</span>
            <span><strong>Examen Psicométrico:</strong> ${
              proceso.examen_psicometrico || "No disponible"
            }</span>
          </div>
        `;
      container.appendChild(card);
    });
  });

  // Ocultar menú si se hace clic fuera
  window.addEventListener("click", function (event) {
    const dropdown = document.getElementById("dropdownMenu");
    const userIcon = document.querySelector(".user-icon");
    if (
      dropdown &&
      !dropdown.contains(event.target) &&
      !userIcon.contains(event.target)
    ) {
      dropdown.style.display = "none";
    }
  });
});
