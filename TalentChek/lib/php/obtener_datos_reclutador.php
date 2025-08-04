<?php
header("Content-Type: application/json");
session_start();
require_once("conexion.php");

if (!isset($_SESSION['correo'])) {
    echo json_encode(["success" => false, "message" => "Sesión no iniciada"]);
    exit;
}

$correo = $_SESSION['correo'];

$stmt = $conn->prepare("SELECT nombre, cue, tipo FROM usuarios WHERE cue = ?");
$stmt->bind_param("s", $correo);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    if (strtolower(trim($row['tipo'])) === 'reclutador') {
        echo json_encode([
            "success" => true,
            "datos" => [
                "nombre" => $row['nombre'],
                "cue" => $row['cue'],
                "tipo" => $row['tipo']
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Acceso denegado: no es reclutador"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
}

$stmt->close();
$conn->close();
?>
