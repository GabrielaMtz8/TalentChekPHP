import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";

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
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registroForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document
      .getElementById("emailreg")
      .value.trim()
      .toLowerCase();
    const password = document.getElementById("passwordreg").value;

    // Validación de campos
    if (!nombre || !email || !password) {
      alert("Por favor completa todos los campos.");
      return;
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) {
      alert("El nombre solo debe contener letras.");
      return;
    }

    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    alert("Procesando registro...");

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);

      const userData = {
        nombre: nombre,
        correo: email,
        uid: cred.user.uid,
        fechaRegistro: new Date().toISOString(),
      };

      // Determinar la rama según el correo
      let rama = "candidatos";
      if (email.includes("admin")) {
        rama = "administradores"; // ✅ corregido
      } else if (email.includes("reclutador")) {
        rama = "reclutadores";
      }

      await set(ref(database, `${rama}/${cred.user.uid}`), userData);

      localStorage.setItem("nombre", nombre);

      alert(
        "Usuario registrado correctamente. Se ha enviado un correo de verificación."
      );
      form.reset();
    } catch (error) {
      const errorCode = error.code;

      if (errorCode === "auth/email-already-in-use")
        alert("El correo ya está en uso");
      else if (errorCode === "auth/invalid-email")
        alert("El correo no es válido");
      else if (errorCode === "auth/weak-password")
        alert("La contraseña debe tener al menos 6 caracteres");
      else alert("Error al registrar: " + error.message);
    }
  });
});
