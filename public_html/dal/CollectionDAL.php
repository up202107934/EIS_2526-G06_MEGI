<?php
require_once __DIR__ . "/../config/db.php";

class CollectionDAL {

    // 1. Buscar todas (Global Home)
    public static function getAll() {
        $db = DB::conn();
        // JOIN para ir buscar o nome do utilizador e da categoria
        // Ajusta 'collection_categories' se a tua tabela tiver outro nome
        $sql = "SELECT c.*, u.username as owner_name, cat.name as category_name 
                FROM collections c
                JOIN users u ON c.id_user = u.id_user
                LEFT JOIN collection_categories cat ON c.id_collection_category = cat.id_collection_category
                ORDER BY c.rate DESC, c.creation_date DESC";
        
        $result = $db->query($sql);
        if (!$result) return [];
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // 2. Buscar por Utilizador (My Recent)
    public static function getByUser($id_user) {
        $db = DB::conn();
        $sql = "SELECT c.*, u.username as owner_name, cat.name as category_name 
                FROM collections c
                JOIN users u ON c.id_user = u.id_user
                LEFT JOIN collection_categories cat ON c.id_collection_category = cat.id_collection_category
                WHERE c.id_user = ?
                ORDER BY c.creation_date DESC";
        
        $stmt = $db->prepare($sql);
        $stmt->bind_param("i", $id_user);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

// Criar nova coleção (Agora com descrição e imagem)
    public static function create($id_user, $id_category, $name, $description, $cover_img, $creation_date) {
        $db = DB::conn();
        
        $sql = "INSERT INTO collections (id_user, id_collection_category, name, description, cover_img, creation_date) 
                VALUES (?, ?, ?, ?, ?, ?)";
        
        $stmt = $db->prepare($sql);
        
        if (!$stmt) {
            die("Erro SQL Create: " . $db->error);
        }

        // iissss = int, int, string, string, string, string
        $stmt->bind_param("iissss", $id_user, $id_category, $name, $description, $cover_img, $creation_date);
        
        if ($stmt->execute()) {
            return $db->insert_id;
        }
        return false;
    }
}