<?php
session_start();
header('Content-Type: application/json');
$conn = new mysqli("localhost","root","","colecoesDB");
$data = json_decode(file_get_contents("php://input"), true);
$username = $conn->real_escape_string($data['username']);
$password = password_hash($data['password'], PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (username,password) VALUES (?,?)");
$stmt->bind_param("ss",$username,$password);
if($stmt->execute()){
    echo json_encode(["success"=>true]);
}else{
    echo json_encode(["success"=>false,"msg"=>"Username já existe"]);
}
$stmt->close();
$conn->close();
?>

