<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TalentCheck</title>
</head>
<body>
    <?php if ($_SESSION['puesto'] == "Desarrollador Web"): ?>
        <?php require 'examenWeb.html'; ?>
    <?php elseif ($_SESSION['puesto'] == "Desarrollador Móvil"): ?>
        <?php require 'examenMovil.html'; ?>
    <?php elseif ($_SESSION['puesto'] == "Administrador de BD"): ?>
        <?php require 'examenBd.html'; ?>   
    <?php else: ?>
        <p>No hay examen disponible para el puesto "<?php echo htmlspecialchars($_SESSION['puesto']); ?>"</p>
    <?php endif; ?>
</body>
</html>
