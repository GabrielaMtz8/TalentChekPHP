<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
date_default_timezone_set("America/Mexico_City");

session_start();
require_once("conexion.php");

$data = json_decode(file_get_contents("php://input"), true);

if (
    !$data ||
    !isset($data['respuestas'], $data['aciertos']) ||
    !isset($_SESSION['correo'])
) {
    echo json_encode(["success" => false, "message" => "Datos incompletos."]);
    exit;
}

$correo = $_SESSION['correo'];
$respuestas = $data['respuestas'];
$aciertosTotales = (int)$data['aciertos'];

// Obtener datos del candidato
$stmt = $conn->prepare("SELECT uid, nombre FROM candidatos WHERE cue = ?");
$stmt->bind_param("s", $correo);
$stmt->execute();
$stmt->bind_result($uid, $nombre);
if (!$stmt->fetch()) {
    echo json_encode(["success" => false, "message" => "Candidato no encontrado."]);
    exit;
}
$stmt->close();

// Mapear respuestas individuales
$q = [];
for ($i = 1; $i <= 10; $i++) {
    $key = "q$i";
    $q[$key] = $respuestas[$key] ?? null;
}

// Insertar en una sola fila
$stmt = $conn->prepare("
    INSERT INTO respuestas_exam_cono (uid, nombre, cue, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, aciertos_totales)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");
$stmt->bind_param(
    "sssssssssssssi",
    $uid, $nombre, $correo,
    $q['q1'], $q['q2'], $q['q3'], $q['q4'], $q['q5'],
    $q['q6'], $q['q7'], $q['q8'], $q['q9'], $q['q10'],
    $aciertosTotales
);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Error al guardar respuestas: " . $stmt->error]);
}
$stmt->close();
$conn->close();
?>
