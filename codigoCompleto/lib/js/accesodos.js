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

// Cerrar sesión
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

// Acceso al examen psicométrico
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
    const claveRef = ref(db, "clavepsico");
    const snapshot = await get(claveRef);

    if (!snapshot.exists()) {
      mensajeError.textContent = "No hay clave configurada.";
      return;
    }

    const claveCorrecta = snapshot.val()["psicométrico"];

    if (claveIngresada !== claveCorrecta) {
      mensajeError.textContent = "Clave incorrecta, intenta de nuevo.";
      return;
    }

    // Guardar acceso al examen
    const accesoRef = ref(
      db,
      `candidatos/${user.uid}/examenesAccedidos/psicometrico`
    );
    await update(accesoRef, {
      clave: claveIngresada,
      acceso: true,
      fechaacceso: new Date().toISOString(),
    });

    mensajeError.textContent = "";
    alert("Clave correcta, accediendo al examen...");
    window.location.href = "examenPsico.html";
  } catch (error) {
    console.error("Error al validar clave:", error);
    mensajeError.textContent = "Error al acceder. Intenta nuevamente.";
  }
});
