<?php
class DB {
    private static $conn;

    public static function conn() {
        if (!self::$conn) {
            self::$conn = new mysqli("localhost", "root", "", "colecoesdb");
            if (self::$conn->connect_error) {
                die("DB error: " . self::$conn->connect_error);
            }
            self::$conn->set_charset("utf8mb4");
        }
        return self::$conn;
    }
}
