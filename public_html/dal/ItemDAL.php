<?php
require_once __DIR__ . "/../config/db.php";

class ItemDAL {

    // -------------------------------------------------
    // 1) Buscar itens de uma coleção (usa collection_items)
    // -------------------------------------------------
    public static function getByCollection($id_collection) {
        $db = DB::conn();
        $stmt = $db->prepare("
            SELECT i.*, i.id_item_category
            FROM items i
            JOIN collection_items ci ON ci.id_item = i.id_item
            WHERE ci.id_collection = ?
        ");
        $stmt->bind_param("i", $id_collection);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }


    // -------------------------------------------------
    // 2) Buscar 1 item individualmente
    // -------------------------------------------------
    public static function getById($id_item) {
        $db = DB::conn();

        $stmt = $db->prepare("SELECT * FROM items WHERE id_item = ?");
        $stmt->bind_param("i", $id_item);
        $stmt->execute();

        return $stmt->get_result()->fetch_assoc();
    }

    // -------------------------------------------------
    // 3) Criar item (INSERT)
    // -------------------------------------------------
    public static function create($data) {
        $db = DB::conn();

        $stmt = $db->prepare("
            INSERT INTO items
                (id_item_category, name, img, importance, weight, price, acquisition_date, franchise)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->bind_param(
            "isssddss",
            $data["id_item_category"],
            $data["name"],
            $data["img"],
            $data["importance"],
            $data["weight"],
            $data["price"],
            $data["acquisition_date"],
            $data["franchise"]
        );

        if (!$stmt->execute()) {
            return false;
        }

        return $db->insert_id;
    }
}