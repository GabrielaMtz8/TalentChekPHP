document.addEventListener("DOMContentLoaded", () => {
  fetch("./lib/php/obtener_datos_candidato.php")
    .then(response => response.json())
    .then(data => {
      console.log("Datos recibidos:", data);  // Esto muestra la respuesta completa
      if (data.success) {
        const { nombre, cue, telefono, puesto } = data.datos;
        document.getElementById("nombreCandidato").textContent = nombre;
        document.getElementById("correoCandidato").textContent = cue;
        document.getElementById("telefonoCandidato").textContent = telefono || "No disponible";
        document.getElementById("puestoCandidato").textContent = puesto || "No disponible";
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch(error => {
      console.error("Error en la consulta:", error);
    });
});
