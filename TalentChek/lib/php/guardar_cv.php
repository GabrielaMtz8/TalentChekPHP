<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once("conexion.php");
session_start();
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Datos no recibidos."]);
    exit;
}

// Validar campos
$nombre = $data["nombre"] ?? null;
$correo = $data["correo"] ?? null;
$telefono = $data["telefono"] ?? null;
$puesto = $data["puesto"] ?? null;

$acepto = isset($data["acepto"]) ? 1 : 0;
$pdfBase64 = $data["pdf_base64"] ?? null;

if (!$nombre || !$correo || !$telefono || !$pdfBase64 || !$puesto) {
    echo json_encode(["success" => false, "message" => "Campos incompletos."]);
    exit;
}

// Buscar UID del candidato
$stmt = $conn->prepare("SELECT uid FROM candidatos WHERE cue = ?");
$stmt->bind_param("s", $correo);
$stmt->execute();
$resultado = $stmt->get_result();

if ($fila = $resultado->fetch_assoc()) {
    $_SESSION['puesto'] = $puesto;
    $uid = $fila['uid'];
    $fechaEnvioCV = date("Y-m-d H:i:s");

    // Actualizar campos del candidato incluyendo el PDF base64
    $stmt_update = $conn->prepare("UPDATE candidatos SET telefono = ?, puesto = ?, fecha_envio_cv = ?, pdf_base64 = ? WHERE cue = ?");
    $stmt_update->bind_param("sssss", $telefono, $puesto, $fechaEnvioCV, $pdfBase64, $correo);

    if ($stmt_update->execute()) {
        echo json_encode(["success" => true, "uid" => $uid]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al actualizar candidato: " . $stmt_update->error]);
    }

    $stmt_update->close();
} else {
    echo json_encode(["success" => false, "message" => "Correo no encontrado en la tabla de candidatos."]);
}

$stmt->close();
$conn->close();
