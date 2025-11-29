<?php
require_once __DIR__ . "/../config/db.php";

class ItemDAL {

    // -------------------------------------------------
    // 1) Buscar itens de uma coleção (usa collection_items)
    // -------------------------------------------------
    public static function getByCollection($id_collection) {
        $db = DB::conn();

        $stmt = $db->prepare("
            SELECT i.id_item, i.name, i.importance, i.price, i.weight
            FROM collection_items ci
            JOIN items i ON i.id_item = ci.id_item
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
}
