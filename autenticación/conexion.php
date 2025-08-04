<?php
$host = "localhost";
$usuario = "root";    
$contrasena = "";     
$basededatos = "talentchek"; 


$conn = new mysqli($host, $usuario, $contrasena, $basededatos);


if ($conn->connect_error) {
    die("Error de conexión a la base de datos: " . $conn->connect_error);
}


$conn->set_charset("utf8");
?>

