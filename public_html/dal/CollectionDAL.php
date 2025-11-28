<?php
require_once __DIR__ . "/../config/db.php";

class CollectionDAL {

    // Buscar todas as coleções
    public static function getAll() {
        $db = DB::conn();
        $sql = "
            SELECT 
                c.id,
                c.nome,
                c.descricao,
                c.created_at,
                c.user_id,
                u.username AS owner_name
            FROM collections c
            JOIN users u ON u.id = c.user_id
            ORDER BY c.id DESC
        ";
        $res = $db->query($sql);
        if (!$res) return [];
        return $res->fetch_all(MYSQLI_ASSOC);
    }

    // Buscar uma coleção por ID
    public static function getById($id) {
        $db = DB::conn();
        $stmt = $db->prepare("
            SELECT 
                c.id,
                c.nome,
                c.descricao,
                c.created_at,
                c.user_id,
                u.username AS owner_name
            FROM collections c
            JOIN users u ON u.id = c.user_id
            WHERE c.id = ?
        ");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // Buscar coleções de um user
    public static function getByUser($user_id) {
        $db = DB::conn();
        $stmt = $db->prepare("
            SELECT 
                c.id,
                c.nome,
                c.descricao,
                c.created_at
            FROM collections c
            WHERE c.user_id = ?
            ORDER BY c.created_at DESC
        ");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    // Criar coleção
    public static function create($user_id, $nome, $descricao) {
        $db = DB::conn();
        $stmt = $db->prepare("
            INSERT INTO collections (user_id, nome, descricao)
            VALUES (?, ?, ?)
        ");
        $stmt->bind_param("iss", $user_id, $nome, $descricao);
        $stmt->execute();
        return $db->insert_id;
    }
}
