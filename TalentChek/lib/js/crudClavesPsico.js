import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

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
const db = getDatabase(app);
const auth = getAuth(app);
const tablaClaves = document.querySelector("#tablaClaves tbody");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "inicioSesion.html";
  }
});

window.toggleMenu = function () {
  const dropdown = document.getElementById("dropdownMenu");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
};

document.getElementById("logoutBtn").addEventListener("click", (e) => {
  e.preventDefault();
  if (confirm("¿Estás seguro de cerrar sesión?")) {
    signOut(auth).then(() => {
      window.location.href = "inicioSesion.html";
    });
  }
});

function cargarClaves() {
  onValue(ref(db, "clavepsico"), (snapshot) => {
    const claves = snapshot.val();
    tablaClaves.innerHTML = "";

    for (const key in claves) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
          <td>${key}</td>
          <td>${claves[key]}</td>
          <td>
            <button onclick="editarClave('${key}', '${claves[key]}')"><i class="fas fa-edit"></i></button>
            <button onclick="confirmarEliminar('${key}')"><i class="fas fa-trash"></i></button>
          </td>
        `;
      tablaClaves.appendChild(tr);
    }
  });
}

cargarClaves();

let claveActual = "";

window.editarClave = (clave, valor) => {
  claveActual = clave;
  document.getElementById("modalEditInput").value = valor;
  document.getElementById("modalEdit").style.display = "flex";
};

document.getElementById("modalEditAccept").onclick = async () => {
  const nuevaClave = document.getElementById("modalEditInput").value.trim();
  if (!nuevaClave) return alert("La clave no puede estar vacía.");
  try {
    await update(ref(db, "clavepsico"), {
      [claveActual]: nuevaClave,
    });
    alert("Clave actualizada.");
    document.getElementById("modalEdit").style.display = "none";
  } catch (e) {
    alert("Error al actualizar: " + e.message);
  }
};

document.getElementById("modalEditCancel").onclick = () => {
  document.getElementById("modalEdit").style.display = "none";
};

window.abrirModalAgregar = () => {
  document.getElementById("modalAddNombre").value = "";
  document.getElementById("modalAddValor").value = "";
  document.getElementById("modalAdd").style.display = "flex";
};

document.getElementById("modalAddAccept").onclick = async () => {
  const nombre = document.getElementById("modalAddNombre").value.trim();
  const valor = document.getElementById("modalAddValor").value.trim();
  if (!nombre || !valor) return alert("Ambos campos son obligatorios.");
  try {
    await update(ref(db, "clavepsico"), {
      [nombre]: valor,
    });
    alert("Clave agregada.");
    document.getElementById("modalAdd").style.display = "none";
  } catch (e) {
    alert("Error al agregar: " + e.message);
  }
};

document.getElementById("modalAddCancel").onclick = () => {
  document.getElementById("modalAdd").style.display = "none";
};

let claveEliminar = "";
window.confirmarEliminar = (clave) => {
  claveEliminar = clave;
  document.getElementById("modalDelete").style.display = "flex";
};

document.getElementById("modalDeleteAccept").onclick = async () => {
  try {
    await remove(ref(db, `clavepsico/${claveEliminar}`));
    alert("Clave eliminada.");
    document.getElementById("modalDelete").style.display = "none";
  } catch (error) {
    alert("Error al eliminar: " + error.message);
  }
};

document.getElementById("modalDeleteCancel").onclick = () => {
  document.getElementById("modalDelete").style.display = "none";
};
