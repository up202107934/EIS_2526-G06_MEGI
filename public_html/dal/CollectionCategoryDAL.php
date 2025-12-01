<?php
require_once __DIR__ . "/../config/db.php";

class CollectionCategoryDAL {

    public static function getAll() {
        $db = DB::conn();
        $sql = "SELECT * FROM collection_categories ORDER BY name ASC";        
        $result = $db->query($sql);
        if (!$result) {
            return [];
        }
        
        // Devolve um array associativo
        return $result->fetch_all(MYSQLI_ASSOC);
    }
}
?>