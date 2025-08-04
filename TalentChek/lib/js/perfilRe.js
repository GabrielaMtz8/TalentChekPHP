document.addEventListener("DOMContentLoaded", () => {
  fetch("lib/php/obtener_datos_reclutador.php")
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const d = data.datos;
        document.getElementById("nombreReclutador").textContent = d.nombre;
        document.getElementById("correoReclutador").textContent = d.cue;
        document.getElementById("tipoReclutador").textContent = d.tipo;
      } else {
        alert(data.message); // por ejemplo: "Acceso denegado: no es reclutador"
        window.location.href = "index.html"; // redirigir si no tiene permiso
      }
    })
    .catch(err => {
      console.error("Error al obtener el perfil:", err);
    });
});
