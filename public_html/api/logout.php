<?php
session_start();
session_destroy();

// Voltar para a home (fora da pasta /api)
header("Location: ../home.php");
exit;
