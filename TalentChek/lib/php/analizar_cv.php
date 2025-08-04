<?php
header("Content-Type: application/json");

session_start();

// Verificar si la sesión está iniciada
if (!isset($_SESSION['correo'])) {
    echo json_encode(["success" => false, "message" => "Sesión no iniciada"]);
    exit;
}

// Conexión a la base de datos
require_once("conexion.php");  // Asegúrate de que la ruta de la conexión sea correcta

$sql = "SELECT nombre, cue, telefono, puesto, pdf_base64 FROM candidatos";  // Consulta SQL para obtener los datos

// Ejecutar la consulta
$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();

$candidatos = [];  // Array para almacenar los datos de los candidatos

// Verificar si la consulta devolvió resultados
if ($result->num_rows > 0) {
    // Recoger cada fila de datos
    while ($row = $result->fetch_assoc()) {
        $candidatos[] = $row;
    }

    // Devolver los datos de los candidatos en formato JSON
    echo json_encode(["success" => true, "candidatos" => $candidatos]);
} else {
    // Si no hay resultados, devolver un mensaje de error
    echo json_encode(["success" => false, "message" => "No hay candidatos disponibles"]);
}

// Cerrar la consulta y la conexión
$stmt->close();
$conn->close();
?>
