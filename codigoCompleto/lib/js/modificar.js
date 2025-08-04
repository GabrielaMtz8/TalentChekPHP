import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  update,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_I3bIIk0nfGvuDSK0nZ_JcI7ywTP_Rd8",
  authDomain: "talentchek-t.firebaseapp.com",
  databaseURL: "https://talentchek-t-default-rtdb.firebaseio.com",
  projectId: "talentchek-t",
  storageBucket: "talentchek-t.appspot.com",
  messagingSenderId: "546382065526",
  appId: "1:546382065526:web:249deb0e90ff9b358bd457",
  measurementId: "G-WCG5D1N4ZJ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let cerrandoSesion = false;

document.getElementById("logoutBtn").addEventListener("click", (event) => {
  event.preventDefault();
  if (confirm("¿Estás seguro que deseas cerrar sesión?")) {
    signOut(auth)
      .then(() => {
        window.location.href = "inicioSesion.html";
      })
      .catch((e) => alert("Error al cerrar sesión: " + e.message));
  }
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    const dbRef = ref(db);

    try {
      const snapshot = await get(child(dbRef, `candidatos/${uid}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        document.getElementById("nombre").value = data.nombre || "";
        document.getElementById("telefono").value = data.telefono || "";
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }

    document
      .querySelector(".edit-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const nuevoNombre = document.getElementById("nombre").value.trim();
        const nuevoTelefono = document.getElementById("telefono").value.trim();

        if (!nuevoNombre || !nuevoTelefono) {
          alert("Completa todos los campos.");
          return;
        }

        try {
          await update(ref(db, `candidatos/${uid}`), {
            nombre: nuevoNombre,
            telefono: nuevoTelefono,
          });
          alert("Datos actualizados correctamente.");
        } catch (error) {
          console.error("Error al actualizar:", error);
          alert("Error al actualizar. Intenta más tarde.");
        }
      });
  }
});

function toggleMenu() {
  const menu = document.getElementById("dropdownMenu");
  menu.classList.toggle("show");
}
