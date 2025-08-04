<?php
require 'conexion.php';

$tipo = $_POST['tipo'] ?? '';

if (!$tipo) {
    die("Falta el tipo de reporte.");
}

if ($tipo === 'Examen de Conocimiento') {
    $tabla = 'respuestas_exam_cono';
    $campos_q = ['q1','q2','q3','q4','q5','q6','q7','q8','q9','q10'];
    $titulo = "Reporte: Examen de Conocimiento";
} elseif ($tipo === 'Examen Psicométrico') {
    $tabla = 'respuestas_exam_psico';
    $campos_q = ['q1','q2','q3','q4','q5','q6','q7'];
    $titulo = "Reporte: Examen Psicométrico";
} else {
    die("Tipo inválido.");
}

$sql = "SELECT * FROM $tabla ORDER BY fecha DESC";
$result = $conn->query($sql);

if (!$result || $result->num_rows === 0) {
    die("No hay resultados.");
}

$filename = "reporte_".str_replace(' ', '_', $tipo)."_".date('Ymd').".csv";

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename='.$filename);

$output = fopen('php://output', 'w');

// Escribir título en la primera fila (celda A1)
fputcsv($output, [$titulo]);

// Escribir fila en blanco para separar título de encabezados
fputcsv($output, []);

// Escribir encabezados
$headers = array_merge(['Nombre', 'CUE'], $campos_q, ['Aciertos Totales', ]);
fputcsv($output, $headers);

// Escribir datos
while ($row = $result->fetch_assoc()) {
    $fila = [
        $row['nombre'],
        $row['cue']
    ];
    foreach ($campos_q as $q) {
        $fila[] = $row[$q];
    }
    $fila[] = $row['aciertos_totales'];
    fputcsv($output, $fila);
}

fclose($output);
exit;
?>
