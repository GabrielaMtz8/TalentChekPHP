<?php
session_start();

// Obtener valores desde la sesión o GET
$nombre = $_SESSION['nombre'] ?? '';
$correo = $_SESSION['correo'] ?? '';
$puesto = $_GET['puesto'] ?? '';
?>
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/png" href="lib/img/logoredondo.png" />
    <title>Subida de CV</title>
    <link rel="stylesheet" href="lib/css/formulario_cv.css">
    <link rel="stylesheet" href="lib/css/cv.css">
    <link rel="stylesheet" href="lib/css/perfilCandidato.css"/>
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  </head>

  <body>
    <div class="card">
        <!-- Encabezado -->
      <header class="main-header">
        <a href="perfilCandidato.html" class="header-left">
          <img src="lib/img/logo.jpg" alt="Logo" />
          <span class="title">TalentCheck</span>
        </a>
        <div class="user-menu">
        <span class="user-icon" onclick="toggleMenu()">👤</span>
        <div id="dropdownMenu" class="dropdown">
          <a href="lib/php/cerrarSesion.php">Cerrar sesión</a>
          <a href="perfil.html">Ver Perfil</a>
        </div>
        </div>
      </header>
        

      <h2>Subida de CV y datos personales</h2>

      <form id="cvForm">
        <label for="nombre">Nombre completo</label>
        <input type="text" id="nombre" name="nombre" value="<?php echo htmlspecialchars($nombre); ?>" disabled required />
        <input type="hidden" name="nombre" value="<?php echo htmlspecialchars($nombre); ?>">

        <label for="correo">Correo electrónico</label>
        <input type="email" id="correo" name="correo" value="<?php echo htmlspecialchars($correo); ?>" disabled required />
        <input type="hidden" name="correo" value="<?php echo htmlspecialchars($correo); ?>">

        <label for="puesto_visible">Puesto</label>
        <input type="text" id="puesto_visible" value="<?php echo htmlspecialchars($puesto); ?>" disabled />
        <input type="hidden" id="puesto" name="puesto" value="<?php echo htmlspecialchars($puesto); ?>">

        <label for="telefono">Teléfono</label>
        <input type="tel" id="telefono" name="telefono" required />

        <div class="cv-upload">
          <input type="file" id="file-input" accept="application/pdf" required />
        </div>

        <div class="checkbox">
          <input type="checkbox" id="acepto" name="acepto" required />
          <label for="acepto">Acepto el uso de mis datos para fines de evaluación</label>
        </div>

        <button type="submit" class="btn-submit">Enviar</button>
      </form>
    </div>
    <script src="lib/js/menuDespegable.js"></script>
    <script src="lib/js/form_cv.js"></script>
    
  </body>
</html>
