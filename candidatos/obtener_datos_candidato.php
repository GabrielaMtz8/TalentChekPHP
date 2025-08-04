<?php
header("Content-Type: application/json");
session_start();
require_once("conexion.php");

// Suponiendo que ya tienes el correo almacenado en la sesión
if (!isset($_SESSION['correo'])) {
    echo json_encode(["success" => false, "message" => "Sesión no iniciada"]);
    exit;
}

$correo = $_SESSION['correo'];

$stmt = $conn->prepare("SELECT nombre, cue, telefono, puesto FROM candidatos WHERE cue = ?");
$stmt->bind_param("s", $correo);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode(["success" => true, "datos" => $row]);
} else {
    echo json_encode(["success" => false, "message" => "Candidato no encontrado"]);
}

$stmt->close();
$conn->close();
?>
