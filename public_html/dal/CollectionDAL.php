<?php
require_once __DIR__ . "/../config/db.php";

class CollectionDAL {

    // 1. Buscar coleções (Global Home) com Filtro de Categoria Opcional
    public static function getAll($categoryId = null) {
        $db = DB::conn();
        
        $sql = "SELECT c.*, u.username as owner_name, cat.name as category_name 
                FROM collections c
                JOIN users u ON c.id_user = u.id_user
                LEFT JOIN collection_categories cat ON c.id_collection_category = cat.id_collection_category";
        
        // Se houver categoria selecionada (e não for "all"), adicionamos WHERE
        if ($categoryId && $categoryId !== 'all') {
            $sql .= " WHERE c.id_collection_category = " . (int)$categoryId;
        }

        $sql .= " ORDER BY c.rate DESC, c.creation_date DESC LIMIT 5"; // Garante sempre apenas 5
        
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
    
    // 3. Buscar UMA coleção pelo ID (Para verificar o dono)
    public static function getById($id_collection) {
        $db = DB::conn();
        $sql = "SELECT * FROM collections WHERE id_collection = ?";
        
        $stmt = $db->prepare($sql);
        $stmt->bind_param("i", $id_collection);
        $stmt->execute();
        
        $result = $stmt->get_result();
        return $result->fetch_assoc(); // Retorna apenas 1 linha ou null
    }

    // 4. Criar nova coleção
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

    // ==========================================================
    // 5. APAGAR COLEÇÃO (NOVO MÉTODO)
    // ==========================================================
    public static function delete($id_collection) {
        $db = DB::conn();
        
        // Prepara o comando DELETE
        $sql = "DELETE FROM collections WHERE id_collection = ?";
        $stmt = $db->prepare($sql);
        
        if (!$stmt) {
            return false; // Erro na preparação
        }

        $stmt->bind_param("i", $id_collection);

        // Executa e retorna true se funcionou
        if ($stmt->execute()) {
            return true;
        }
        
        return false;
    }
}