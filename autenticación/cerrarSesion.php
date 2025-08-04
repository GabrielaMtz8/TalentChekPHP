<?php
session_start();

if (isset($_GET['confirmar']) && $_GET['confirmar'] == 1) {
    // Cierra la sesión
    session_unset(); 
    session_destroy(); 
    header("Location: ../../inicioSesion.html");
    exit;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Confirmar cierre de sesión</title>
  <link rel="stylesheet" href="../css/cerrarSesion.css">
</head>
<body>

<div class="overlay" id="modalCerrarSesion">
  <div class="modal">
    <p>¿Seguro que deseas cerrar sesión?</p>
    <div class="buttons">
      <button class="btn btn-aceptar" onclick="confirmarCerrarSesion()">Aceptar</button>
      <button class="btn btn-cancelar" onclick="cancelarCerrarSesion()">Cancelar</button>
    </div>
  </div>
</div>

<script>
  // Mostrar el modal al cargar
  window.addEventListener('DOMContentLoaded', function () {
    document.getElementById('modalCerrarSesion').style.display = 'flex';
  });

  function confirmarCerrarSesion() {
    window.location.href = "cerrarSesion.php?confirmar=1";
  }

  function cancelarCerrarSesion() {
    window.history.back();
  }
</script>

</body>
</html>
