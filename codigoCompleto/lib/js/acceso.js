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
  update,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Configuración de Firebase
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

// Menú desplegable usuario
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

// Verifica que el usuario esté autenticado
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "inicioSesion.html";
  }
});

// Cerrar sesión con confirmación
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const confirmado = confirm("¿Estás seguro de que quieres cerrar sesión?");
  if (!confirmado) return;
  try {
    await signOut(auth);
    window.location.href = "inicioSesion.html";
  } catch (error) {
    alert("Error al cerrar sesión: " + error.message);
  }
});

// Acceso al examen por clave en Firebase
const btnAcceder = document.getElementById("btnAcceder");
const inputClave = document.getElementById("clave");
const mensajeError = document.getElementById("mensajeError");

btnAcceder.addEventListener("click", async () => {
  const claveIngresada = inputClave.value.trim();

  if (!claveIngresada) {
    mensajeError.textContent = "Por favor ingresa una clave.";
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    mensajeError.textContent = "Usuario no autenticado.";
    return;
  }

  try {
    const clavesRef = ref(db, "clavesexam");
    const snapshot = await get(clavesRef);

    if (!snapshot.exists()) {
      mensajeError.textContent = "No hay claves configuradas.";
      return;
    }

    const clavesData = snapshot.val();
    let tipoClaveEncontrada = null;

    // Buscar si la clave ingresada coincide con algún valor
    for (const tipo in clavesData) {
      if (clavesData[tipo] === claveIngresada) {
        tipoClaveEncontrada = tipo; // Ej: "web", "bd", "movil"
        break;
      }
    }

    if (!tipoClaveEncontrada) {
      mensajeError.textContent = "Clave incorrecta, intenta de nuevo.";
      return;
    }

    // Mapear tipo a URL de examen
    const urls = {
      web: "examenWeb.html",
      movil: "examenMovil.html",
      bd: "examenBd.html",
    };

    const examenURL = urls[tipoClaveEncontrada] || "examComo.html"; // fallback

    // Guardar acceso
    const examRef = ref(
      db,
      `candidatos/${user.uid}/examenesAccedidos/${tipoClaveEncontrada}`
    );
    await update(examRef, {
      clave: claveIngresada,
      acceso: true,
      fechaacceso: new Date().toISOString(),
    });

    mensajeError.textContent = "";
    alert("Clave correcta, accediendo al examen...");
    window.location.href = examenURL;
  } catch (error) {
    console.error("Error al validar clave:", error);
    mensajeError.textContent = "Error al acceder. Intenta nuevamente.";
  }
});
