<?php
require_once __DIR__ . "/../config/db.php";

class CollectionItemDAL {

    // Adicionar item a uma coleção
    public static function add($id_item, $id_collection, $quantity = 1) {
        $db = DB::conn();

        $stmt = $db->prepare("
            INSERT INTO collection_items (id_collection, id_item, quantity)
            VALUES (?, ?, ?)
        ");
        $stmt->bind_param("iii", $id_collection, $id_item, $quantity);

        return $stmt->execute();
    }
    // Remover item de uma coleção
    public static function remove($id_collection, $id_item) {
    $db = DB::conn();
    $stmt = $db->prepare("
        DELETE FROM collection_items
        WHERE id_collection = ? AND id_item = ?
    ");
    $stmt->bind_param("ii", $id_collection, $id_item);
    return $stmt->execute();
}

}
