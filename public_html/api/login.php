<?php
session_start();
header('Content-Type: application/json');
$conn = new mysqli("localhost","root","","colecoesDB");
$data = json_decode(file_get_contents("php://input"), true);
$username = $conn->real_escape_string($data['username']);
$password = $data['password'];
$stmt = $conn->prepare("SELECT id,password FROM users WHERE username=?");
$stmt->bind_param("s",$username);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($id,$hash);
if($stmt->num_rows > 0){
    $stmt->fetch();
    if(password_verify($password,$hash)){
        $_SESSION['user_id'] = $id;
        $_SESSION['username'] = $username;
        echo json_encode(["success"=>true]);
        exit;
    }
}
echo json_encode(["success"=>false,"msg"=>"Login inválido"]);
$stmt->close();
$conn->close();
?>

