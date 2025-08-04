<?php
session_start();
require 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cue = strtolower(trim($_POST['cue'] ?? ''));
    $match = $_POST['match'] ?? '';

    if (empty($cue) || empty($match)) {
        $mensaje = 'Por favor completa todos los campos.';
        $url = '../../inicioSesion.html';
    } else {
        $stmt = $conn->prepare("SELECT id, nombre, match_clave, tipo FROM usuarios WHERE cue = ?");
        $stmt->bind_param("s", $cue);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows === 1) {
            $stmt->bind_result($id, $nombre, $hash_clave, $tipo);
            $stmt->fetch();

            if (password_verify($match, $hash_clave)) {
                $_SESSION['uid'] = $id;
                $_SESSION['correo']=$cue;
                $_SESSION['nombre'] = $nombre;
                $_SESSION['tipo'] = $tipo;

                // Mensaje y URL según tipo
                switch ($tipo) {
                    case 'reclutador':
                        $mensaje = "Bienvenido, Reclutador $nombre.";
                        $url = '../../perfilReclutador.html';
                        break;
                    case 'candidato':
                        $mensaje = "Bienvenido, Candidato $nombre.";
                        $url = '../../perfilCandidato.html';
                        break;
                    case 'administrador':
                        $mensaje = "Bienvenido, Administrador $nombre.";
                        $url = '../../perfilAdm.html';
                        break;
                    default:
                        $mensaje = 'Tipo de usuario desconocido.';
                        $url = '../../inicioSesion.html';
                }
            } else {
                $mensaje = 'Datos incorrectos';
                $url = '../../inicioSesion.html';
            }
        } else {
            $mensaje = 'El usuario no existe.';
            $url = '../../inicioSesion.html';
        }

        $stmt->close();
    }

    $conn->close();

    echo "<script>
        alert(" . json_encode($mensaje) . ");
        window.location.href = " . json_encode($url) . ";
    </script>";
    exit;
} else {
    header("Location: ../../inicioSesion.html");
    exit;
}
