<?php
require_once __DIR__ . "/../config/db.php";

class CollectionDAL {

    // Buscar todas as coleções (para a Home)
    public static function getAll() {
        $db = DB::conn();
        $sql = "
            SELECT 
                c.id_collection,
                c.name,
                c.creation_date,
                c.id_user,
                c.id_collection_category,
                u.name AS owner_name,
                cc.name AS category_name
            FROM collections c
            JOIN users u ON u.id_user = c.id_user
            JOIN collection_categories cc 
                ON cc.id_collection_category = c.id_collection_category
            ORDER BY c.id_collection DESC
        ";
        $res = $db->query($sql);
        if (!$res) return [];
        return $res->fetch_all(MYSQLI_ASSOC);
    }

    // Buscar uma coleção por ID (para collection.php)
    public static function getById($id_collection) {
        $db = DB::conn();
        $stmt = $db->prepare("
            SELECT 
                c.id_collection,
                c.name,
                c.creation_date,
                c.id_user,
                c.id_collection_category,
                u.name AS owner_name,
                cc.name AS category_name
            FROM collections c
            JOIN users u ON u.id_user = c.id_user
            JOIN collection_categories cc 
                ON cc.id_collection_category = c.id_collection_category
            WHERE c.id_collection = ?
        ");
        $stmt->bind_param("i", $id_collection);
        $stmt->execute();
        $res = $stmt->get_result();
        return $res->fetch_assoc();
    }

    // Buscar coleções de um user logado
    public static function getByUser($id_user) {
        $db = DB::conn();
        $stmt = $db->prepare("
            SELECT * 
            FROM collections
            WHERE id_user = ?
            ORDER BY id_collection DESC
        ");
        $stmt->bind_param("i", $id_user);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    // Criar coleção (para new_collection.php)
    public static function create($data, $id_user) {
        $db = DB::conn();
        $stmt = $db->prepare("
            INSERT INTO collections
                (id_user, id_collection_category, name, creation_date)
            VALUES (?, ?, ?, ?)
        ");

        $id_category   = $data["id_collection_category"] ?? null;
        $name          = $data["name"] ?? "";
        $creation_date = $data["creation_date"] ?? null;

        $stmt->bind_param("iiss", $id_user, $id_category, $name, $creation_date);
        return $stmt->execute();
    }
}
