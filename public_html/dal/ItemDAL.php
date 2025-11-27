<?php
require_once __DIR__ . "/../config/db.php";

class ItemDAL {

    // itens de uma coleção (com categoria + quantidade)
    public static function getByCollection($id_collection) {
        $db = DB::conn();
        $stmt = $db->prepare("
            SELECT 
                i.*,
                ic.name AS category_name,
                ci.quantity
            FROM collection_items ci
            JOIN items i ON i.id_item = ci.id_item
            JOIN item_categories ic ON ic.id_item_category = i.id_item_category
            WHERE ci.id_collection = ?
        ");
        $stmt->bind_param("i", $id_collection);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    // (opcional já para depois) ir buscar 1 item
    public static function getById($id_item) {
        $db = DB::conn();
        $stmt = $db->prepare("
            SELECT i.*, ic.name AS category_name
            FROM items i
            JOIN item_categories ic ON ic.id_item_category = i.id_item_category
            WHERE i.id_item = ?
        ");
        $stmt->bind_param("i", $id_item);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }
}
