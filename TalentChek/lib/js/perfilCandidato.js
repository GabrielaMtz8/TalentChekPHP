// Funciones menú usuario
function toggleMenu() {
  const menu = document.getElementById("dropdownMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Muestra el nombre del candidato desde sessionStorage
const candidateName = sessionStorage.getItem("candidateName") || "Candidato";
document.getElementById("candidateName").textContent = candidateName;

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_I3bIIk0nfGvuDSK0nZ_JcI7ywTP_Rd8",
  authDomain: "talentchek-t.firebaseapp.com",
  projectId: "talentchek-t",
  storageBucket: "talentchek-t.appspot.com",
  messagingSenderId: "546382065526",
  appId: "1:546382065526:web:249deb0e90ff9b358bd457",
  measurementId: "G-WCG5D1N4ZJ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Verificar sesión activa al cargar la página
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // No está logueado, redirigir a login/index
    window.location.href = "index.html";
  } else {
    console.log("Usuario activo:", user.email);
  }
});

// Botón cerrar sesión
document.getElementById("logoutBtn").addEventListener("click", () => {
  if (confirm("¿Estás seguro que deseas cerrar sesión?")) {
    signOut(auth)
      .then(() => {
        window.location.href = "inicioSesion.html";
      })
      .catch((e) => alert("Error al cerrar sesión: " + e.message));
  }
});
