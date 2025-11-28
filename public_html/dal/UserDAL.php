<?php
require_once __DIR__ . "/../config/db.php";

class UserDAL {

    public static function getByUsername($username) {
        $db = DB::conn();
        $stmt = $db->prepare("SELECT * FROM users WHERE username=?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public static function getByEmail($email) {
        $db = DB::conn();
        $stmt = $db->prepare("SELECT * FROM users WHERE email=?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public static function create($data) {
        $db = DB::conn();

        $username = $data["username"];
        $email = $data["email"]; // tens que adicionar a coluna email primeiro
        $pass = $data["password"];

        $hash = password_hash($pass, PASSWORD_DEFAULT);

        $stmt = $db->prepare("INSERT INTO users (username,password,email) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $username,$hash,$email);

        return $stmt->execute();
    }

}
