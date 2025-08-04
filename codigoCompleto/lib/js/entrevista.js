// Funciones menú usuario
function toggleMenu() {
  const menu = document.getElementById("dropdownMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

document.querySelector(".btn-monitoreo").addEventListener("click", function () {
  alert("🔔 Enciende la cámara para iniciar el monitoreo.");
});

document
  .querySelector(".entrevista-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Datos guardados correctamente.");
  });

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const emailInput = document.getElementById("email");
      const passwordInput = document.getElementById("password");

      // Evita error si no existen los elementos
      if (!emailInput || !passwordInput) {
        alert("No se encontró el input de email o password.");
        return;
      }

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!email || !password) {
        alert("Por favor completa todos los campos.");
        return;
      }

      try {
        const { user } = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (user.email.toLowerCase() === "reclutador@gmail.com") {
          alert("Bienvenido, Reclutador.");
          window.location.href = "perfilReclutador.html";
        } else {
          alert("Inicio de sesión exitoso.");
          window.location.href = "perfilCandidato.html";
        }
      } catch (error) {
        switch (error.code) {
          case "auth/invalid-email":
            alert("El correo no es válido");
            break;
          case "auth/user-disabled":
            alert("El usuario ha sido deshabilitado");
            break;
          case "auth/user-not-found":
            alert("El usuario no existe");
            break;
          case "auth/wrong-password":
            alert("Contraseña incorrecta");
            break;
          default:
            alert("Error al iniciar sesión: " + error.message);
        }
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      const confirmar = confirm("¿Estás seguro de que deseas cerrar sesión?");
      if (!confirmar) return;

      try {
        await signOut(auth);
        window.location.href = "inicioSesion.html";
      } catch (error) {
        alert("Error al cerrar sesión: " + error.message);
      }
    });
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Usuario activo:", user.email);
    } else {
      console.log("No hay usuario logueado");
    }
  });
});
