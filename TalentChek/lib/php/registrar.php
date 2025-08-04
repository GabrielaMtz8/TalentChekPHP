<?php
require 'conexion.php';

function alerta_redirigir($mensaje, $ruta = '../../registrar.html') {
    echo "<script>
        alert(" . json_encode($mensaje) . ");
        window.location.href = '$ruta';
    </script>";
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = trim($_POST['nombre'] ?? '');
    $cue = strtolower(trim($_POST['cue'] ?? ''));
    $match_clave = $_POST['match'] ?? '';

    // Validaciones
    if (!$nombre || !$cue || !$match_clave) {
        alerta_redirigir("Por favor completa todos los campos.");
    }

    if (!preg_match("/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/u", $nombre)) {
        alerta_redirigir("El nombre solo debe contener letras y espacios.");
    }

    if (!filter_var($cue, FILTER_VALIDATE_EMAIL)) {
        alerta_redirigir("El correo electrónico no es válido.");
    }

    if (strlen($match_clave) < 6) {
        alerta_redirigir("La contraseña debe tener al menos 6 caracteres.");
    }

    // Determinar tipo
    $tipo = 'candidato';
    if (strpos($cue, 'admin') !== false) {
        $tipo = 'administrador';
    } elseif (strpos($cue, 'reclutador') !== false) {
        $tipo = 'reclutador';
    }

    // Verificar si ya existe
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE cue = ?");
    $stmt->bind_param("s", $cue);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->close();
        $conn->close();
        alerta_redirigir("El correo ya está en uso.");
    }
    $stmt->close();

    // Insertar usuario
    $passwordHash = password_hash($match_clave, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO usuarios (nombre, cue, match_clave, tipo) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $nombre, $cue, $passwordHash, $tipo);

    if ($stmt->execute()) {
        echo "<script>
            alert('Usuario registrado correctamente.');
            window.location.href = '../../inicioSesion.html';
        </script>";
    } else {
        alerta_redirigir("Error al registrar: " . $conn->error);
    }

    $stmt->close();
    $conn->close();
} else {
    header("Location: ../../registrar.html");
    exit;
}
