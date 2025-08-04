<?php
session_start();

if (isset($_SESSION['uid'])) {
    header("Location: index.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="es" >
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Debes iniciar sesión</title>
  <style>
    .modal-bg {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      animation: fadeInBg 0.4s ease forwards;
    }
    @keyframes fadeInBg {
      from {background: rgba(0, 0, 0, 0);}
      to {background: rgba(0, 0, 0, 0.7);}
    }
    .modal {
      background: #fff;
      border-radius: 12px;
      max-width: 420px;
      width: 90%;
      padding: 30px 40px;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
      text-align: center;
      animation: slideIn 0.5s ease forwards;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .modal h2 {
      margin-bottom: 12px;
      font-size: 1.8rem;
      color: #222;
    }
    .modal p {
      font-size: 1.1rem;
      color: #555;
      margin-bottom: 24px;
      line-height: 1.4;
    }
    button {
      background-color: #007BFF;
      border: none;
      color: white;
      font-size: 1.1rem;
      padding: 12px 35px;
      border-radius: 50px;
      cursor: pointer;
      box-shadow: 0 6px 12px rgba(0, 123, 255, 0.6);
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
      font-weight: 600;
    }
    button:hover {
      background-color: #0056b3;
      box-shadow: 0 8px 20px rgba(0, 86, 179, 0.7);
    }
    @media (max-width: 480px) {
      .modal {
        padding: 25px 20px;
      }
      .modal h2 {
        font-size: 1.5rem;
      }
      .modal p {
        font-size: 1rem;
      }
      button {
        width: 100%;
        padding: 14px;
      }
    }
  </style>
</head>
<body>
  <div class="modal-bg" role="dialog" aria-modal="true" aria-labelledby="modalTitle" aria-describedby="modalDesc">
    <div class="modal">
      <h2 id="modalTitle">Debes iniciar sesión</h2>
      <p id="modalDesc">Para acceder a esta sección, por favor inicia sesión.</p>
      <form action="../../inicioSesion.html" method="get" >
        <button type="submit" aria-label="Aceptar y regresar al inicio">Aceptar</button>
      </form>
    </div>
  </div>
</body>
</html>