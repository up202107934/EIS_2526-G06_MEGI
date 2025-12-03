<?php
require_once __DIR__ . "/../config/db.php";

class ItemDAL {

    // 1. Buscar itens de uma coleção
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

    // 2. Buscar 1 item (COM DONO, ID DA COLEÇÃO E NOME DA COLEÇÃO)
    public static function getById($id_item) {
        $db = DB::conn();

        // Adicionámos 'c.name as collection_name' ao SELECT
        $sql = "SELECT i.*, c.id_user as owner_id, c.id_collection, c.name as collection_name
                FROM items i
                JOIN collection_items ci ON i.id_item = ci.id_item
                JOIN collections c ON ci.id_collection = c.id_collection
                WHERE i.id_item = ?";

        $stmt = $db->prepare($sql);
        $stmt->bind_param("i", $id_item);
        $stmt->execute();

        return $stmt->get_result()->fetch_assoc();
    }

    // 3. Criar item (Mantido o teu original, ajusta se necessário)
    public static function create($data) {
        $db = DB::conn();
        $sql = "INSERT INTO items (id_item_category, name, img, importance, weight, price, acquisition_date, franchise) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                
        $stmt = $db->prepare($sql);
        // Note: Removi 'description' daqui também se não existir na tabela
        $stmt->bind_param("isssddss", 
            $data["id_item_category"], $data["name"], $data["img"], 
            $data["importance"], $data["weight"], $data["price"], $data["acquisition_date"], $data["franchise"]
        );

        if ($stmt->execute()) return $db->insert_id;
        return false;
    }

    // 4. ATUALIZAR ITEM (CORRIGIDO: Sem Description)
    public static function update($id, $name, $rating, $price, $weight, $date, $franchise, $img = null) {
        $db = DB::conn();

        if ($img) {
            // Com imagem nova
            // REMOVIDO: description=?
            $sql = "UPDATE items SET name=?, importance=?, price=?, weight=?, acquisition_date=?, franchise=?, img=? WHERE id_item=?";
            $stmt = $db->prepare($sql);
            
            if (!$stmt) die("Erro SQL Update: " . $db->error);

            // siddssi (sem a string da description)
            $stmt->bind_param("siddsssi", $name, $rating, $price, $weight, $date, $franchise, $img, $id);
        } else {
            // Sem imagem nova
            // REMOVIDO: description=?
            $sql = "UPDATE items SET name=?, importance=?, price=?, weight=?, acquisition_date=?, franchise=? WHERE id_item=?";
            $stmt = $db->prepare($sql);

            if (!$stmt) die("Erro SQL Update: " . $db->error);

            // siddsi (sem a string da description)
            $stmt->bind_param("siddssi", $name, $rating, $price, $weight, $date, $franchise, $id);
        }
        return $stmt->execute();
    }

    // 5. APAGAR ITEM
    public static function delete($id_item) {
        $db = DB::conn();
        $db->query("DELETE FROM collection_items WHERE id_item = " . (int)$id_item);
        
        $stmt = $db->prepare("DELETE FROM items WHERE id_item = ?");
        $stmt->bind_param("i", $id_item);
        return $stmt->execute();
    }
}