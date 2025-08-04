document.getElementById("cvForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const telefono = document.getElementById("telefono").value;
  const acepto = document.getElementById("acepto").checked;
  const fileInput = document.getElementById("file-input");
  const puesto=document.getElementById("puesto").value;
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor selecciona un archivo.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const base64PDF = reader.result.split(",")[1]; // quitar el encabezado "data:application/pdf;base64,"

    const data = {
      nombre,
      correo,
      puesto,
      telefono,
      acepto,
      pdf_base64: base64PDF,
    };

    fetch("./lib/php/guardar_cv.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        if (result.success) {
          alert("CV enviado correctamente.");
          window.location.href="perfilCandidato.html"
        } else {
          alert("Error: " + result.message);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error al enviar los datos.");
      });
  };

  reader.readAsDataURL(file); // Convierte a base64 con encabezado
});
