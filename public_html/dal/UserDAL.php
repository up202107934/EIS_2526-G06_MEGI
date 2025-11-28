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

        $name = $data["name"] ?? "";
        $dob  = $data["date_of_birth"] ?? null;
        $email = $data["email"] ?? "";
        $username = $data["username"] ?? "";
        $pass = $data["password"] ?? "";

        $hash = password_hash($pass, PASSWORD_DEFAULT);

        $stmt = $db->prepare("
            INSERT INTO users (name, date_of_birth, email, date_of_joining, username, password_hash)
            VALUES (?, ?, ?, CURDATE(), ?, ?)
        ");
        $stmt->bind_param("sssss", $name, $dob, $email, $username, $hash);
        return $stmt->execute();
    }
}
