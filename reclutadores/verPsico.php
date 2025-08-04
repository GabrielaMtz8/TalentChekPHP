<?php
include 'conexion.php';

$sql = "SELECT r.*, c.puesto 
        FROM respuestas_exam_psico r
        LEFT JOIN candidatos c ON r.cue = c.cue
        ORDER BY r.fecha DESC";

$resultado = $conn->query($sql);

$datos = [];
if ($resultado->num_rows > 0) {
  while ($row = $resultado->fetch_assoc()) {
    $datos[] = $row;
  }
}

header('Content-Type: application/json');
echo json_encode($datos);

$conn->close();
?>
