<?php
session_start();
header('Content-Type: application/json');
if(!isset($_SESSION['user_id'])){
    echo json_encode(["success"=>false,"msg"=>"Não autenticado"]);
    exit;
}
$conn = new mysqli("localhost","root","","colecoesDB");
$user_id = $_SESSION['user_id'];
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $data = json_decode(file_get_contents("php://input"), true);
    $nome = $conn->real_escape_string($data['nome']);
    $desc = $conn->real_escape_string($data['desc']);
    $stmt = $conn->prepare("INSERT INTO collections (user_id,nome,desc) VALUES (?,?,?)");
    $stmt->bind_param("iss",$user_id,$nome,$desc);
    $stmt->execute();
    $stmt->close();
    echo json_encode(["success"=>true]);
}else{
    $stmt = $conn->prepare("SELECT id,nome,desc,created_at FROM collections WHERE user_id=? ORDER BY created_at DESC");
    $stmt->bind_param("i",$user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $collections = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($collections);
    $stmt->close();
}
$conn->close();
?>


