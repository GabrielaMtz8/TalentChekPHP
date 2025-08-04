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
  createUserWithEmailAndPassword,
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
const tablaCorreos = document.querySelector("#tablaCorreos tbody");

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

function cargarCorreos() {
  onValue(ref(db, "reclutadores"), (snapshot) => {
    tablaCorreos.innerHTML = "";
    let index = 1;
    snapshot.forEach((child) => {
      const uid = child.key;
      const datos = child.val();
      const correo = datos.correo ?? "Sin correo";
      const estado = datos.estado ?? "Activo";

      const tr = document.createElement("tr");
      tr.innerHTML = `
          <td>${index++}</td>
          <td>${correo}</td>
          <td>${estado}</td>
          <td>
            <button onclick="editarCorreo('${uid}', '${correo}')"><i class="fas fa-edit"></i></button>
            <button onclick="confirmarEliminar('${uid}')"><i class="fas fa-trash"></i></button>
          </td>
        `;
      tablaCorreos.appendChild(tr);
    });
  });
}

cargarCorreos();

window.openAddModal = () => {
  document.getElementById("modalAdd").style.display = "flex";
};

document.getElementById("modalAddAccept").onclick = async () => {
  const correo = document.getElementById("modalAddInput").value.trim();
  if (!correo) return alert("Correo no válido.");
  try {
    const tempPass = "cambioTemporal123";
    const userCred = await createUserWithEmailAndPassword(
      auth,
      correo,
      tempPass
    );
    const uid = userCred.user.uid;
    await update(ref(db, "reclutadores/" + uid), {
      correo: correo,
      estado: "Activo",
    });
    alert("Correo agregado correctamente.");
    document.getElementById("modalAddInput").value = "";
    document.getElementById("modalAdd").style.display = "none";
  } catch (e) {
    alert("Error al agregar: " + e.message);
  }
};

document.getElementById("modalAddCancel").onclick = () => {
  document.getElementById("modalAdd").style.display = "none";
};

window.editarCorreo = (uid, correoActual) => {
  document.getElementById("modalEditInput").value = correoActual;
  document.getElementById("modalEdit").style.display = "flex";

  document.getElementById("modalEditAccept").onclick = async () => {
    const nuevoCorreo = document.getElementById("modalEditInput").value.trim();
    if (!nuevoCorreo || nuevoCorreo === correoActual) return;

    try {
      await update(ref(db, "reclutadores/" + uid), {
        correo: nuevoCorreo,
      });
      alert("Correo actualizado en base de datos.");
      document.getElementById("modalEdit").style.display = "none";
    } catch (e) {
      alert("Error al editar: " + e.message);
    }
  };

  document.getElementById("modalEditCancel").onclick = () => {
    document.getElementById("modalEdit").style.display = "none";
  };
};

window.confirmarEliminar = (uid) => {
  document.getElementById("modalDelete").style.display = "flex";

  document.getElementById("modalDeleteAccept").onclick = async () => {
    try {
      await remove(ref(db, "reclutadores/" + uid));
      alert("Correo eliminado de la base de datos.");
      window.location.reload();
    } catch (error) {
      alert("Error al eliminar: " + error.message);
    }
    document.getElementById("modalDelete").style.display = "none";
  };

  document.getElementById("modalDeleteCancel").onclick = () => {
    document.getElementById("modalDelete").style.display = "none";
  };
};
