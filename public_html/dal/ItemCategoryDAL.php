<?php
require_once __DIR__ . "/../config/db.php";

class ItemCategoryDAL {

    public static function getAll() {
        $db = DB::conn();
        $res = $db->query("SELECT * FROM item_categories ORDER BY name ASC");
        if (!$res) return [];
        return $res->fetch_all(MYSQLI_ASSOC);
    }
}
