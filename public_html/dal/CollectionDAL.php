<?php
require_once __DIR__ . "/../config/db.php";

class CollectionDAL {

    // 1. Buscar coleções (Global Home) com Filtro de Categoria e Pesquisa Opcionais
    public static function getAll($categoryId = null, $searchTerm = null, $limit = 5) {
        $db = DB::conn();
        
        $sql = "SELECT c.*, u.username as owner_name, cat.name as category_name 
                FROM collections c
                JOIN users u ON c.id_user = u.id_user
                LEFT JOIN collection_categories cat ON c.id_collection_category = cat.id_collection_category
                WHERE 1=1";

        $types = "";
        $params = [];

        // Filtro por categoria
        if ($categoryId && $categoryId !== 'all') {
            $sql    .= " AND c.id_collection_category = ?";
            $types  .= "i";
            $params[] = (int)$categoryId;
        }

        // Pesquisa por nome da coleção
        if ($searchTerm) {
            $sql    .= " AND c.name LIKE ?";
            $types  .= "s";
            $params[] = "%" . $searchTerm . "%";
        }

        $sql .= " ORDER BY c.rate DESC, c.creation_date DESC";

        // Limite opcional (null = sem limite)
        if ($limit !== null) {
            $sql    .= " LIMIT ?";
            $types  .= "i";
            $params[] = (int)$limit;
        }
        
        $stmt = $db->prepare($sql);
        if (!$stmt) return [];

        if (!empty($types)) {
            $stmt->bind_param($types, ...$params);
        }

        $stmt->execute();
        $result = $stmt->get_result();
        
        if (!$result) return [];
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // 2. Buscar por Utilizador (My Recent)
    public static function getByUser($id_user, $searchTerm = null) {
        $db = DB::conn();
        $sql = "SELECT c.*, u.username as owner_name, cat.name as category_name
                FROM collections c
                JOIN users u ON c.id_user = u.id_user
                LEFT JOIN collection_categories cat ON c.id_collection_category = cat.id_collection_category
                WHERE c.id_user = ?";

        $params = [ $id_user ];
        $types  = "i";

        if ($searchTerm) {
            $sql   .= " AND c.name LIKE ?";
            $types .= "s";
            $params[] = "%" . $searchTerm . "%";
        }

        $sql .= " ORDER BY c.creation_date DESC LIMIT 5";
        
        $stmt = $db->prepare($sql);
        if (!$stmt) {
            return [];
        }

        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
    
    // 2b. Buscar todas as coleções de um utilizador (sem limite) com contagem de items
    public static function getByUserFull($id_user) {
        $db = DB::conn();

        $sql = "SELECT c.*, u.username as owner_name, u.name as owner_fullname, cat.name as category_name,
                       COUNT(ci.id_item) as item_count
                FROM collections c
                JOIN users u ON c.id_user = u.id_user
                LEFT JOIN collection_categories cat ON c.id_collection_category = cat.id_collection_category
                LEFT JOIN collection_items ci ON ci.id_collection = c.id_collection
                WHERE c.id_user = ?
                GROUP BY c.id_collection
                ORDER BY c.creation_date DESC";

        $stmt = $db->prepare($sql);

        if (!$stmt) {
            return [];
        }

        $stmt->bind_param("i", $id_user);
        $stmt->execute();

        $result = $stmt->get_result();
        return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }
    
    // 3. Buscar UMA coleção pelo ID (Para verificar o dono)
    public static function getById($id_collection) {
        $db = DB::conn();
        $sql = "SELECT c.*, u.id_user AS owner_id, u.username AS owner_username, u.name AS owner_name
                FROM collections c
                JOIN users u ON c.id_user = u.id_user
                WHERE c.id_collection = ?";
        
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

    // 6. Atualizar a imagem de capa de uma coleção (apenas do dono)
    public static function updateCover($id_collection, $id_user, $cover_img) {
        $db = DB::conn();

        $sql = "UPDATE collections SET cover_img = ? WHERE id_collection = ? AND id_user = ?";
        $stmt = $db->prepare($sql);

        if (!$stmt) {
            return false;
        }

        $stmt->bind_param("sii", $cover_img, $id_collection, $id_user);

        if ($stmt->execute()) {
            return $stmt->affected_rows > 0;
        }

        
        return false;
    }
}