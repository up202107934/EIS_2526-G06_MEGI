<?php
require_once __DIR__ . "/../config/db.php";

class ItemDAL {

    // 1. Buscar itens de uma coleção
  public static function getByCollection($id_collection) {
  $db = DB::conn();

  $stmt = $db->prepare("
    SELECT
      i.id_item,
      i.name,
      i.img,
      i.importance,
      i.price,
      i.weight,
      i.acquisition_date,
      i.franchise,
      i.id_item_category,
      ic.name AS category_name
    FROM collection_items ci
    JOIN items i ON i.id_item = ci.id_item
    LEFT JOIN item_categories ic ON ic.id_item_category = i.id_item_category
    WHERE ci.id_collection = ?
    ORDER BY i.id_item DESC
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
        $sql = "INSERT INTO items 
                (id_item_category, name, description, img, importance, weight, price, acquisition_date, franchise)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

                
        $stmt = $db->prepare($sql);
        $stmt->bind_param("isssddsss", 
                $data["id_item_category"],
                $data["name"],
                $data["description"],
                $data["img"],
                $data["importance"],
                $data["weight"],
                $data["price"],
                $data["acquisition_date"],
                $data["franchise"]
            );


        if ($stmt->execute()) return $db->insert_id;
        return false;
    }

    // 4. ATUALIZAR ITEM (CORRIGIDO: Sem Description)
    public static function update($id, $name, $description, $rating, $price, $weight, $date, $franchise, $img = null) {
    $db = DB::conn();

    if ($img) {
        // Atualizar COM nova imagem
        $sql = "UPDATE items 
                SET name = ?, 
                    description = ?, 
                    importance = ?, 
                    price = ?, 
                    weight = ?, 
                    acquisition_date = ?, 
                    franchise = ?, 
                    img = ?
                WHERE id_item = ?";
        $stmt = $db->prepare($sql);

        if (!$stmt) {
            die("Erro SQL (prepare com imagem): " . $db->error);
        }

        $stmt->bind_param(
            "ssiddsssi",
            $name,         // s
            $description,  // s
            $rating,       // i
            $price,        // d
            $weight,       // d
            $date,         // s
            $franchise,    // s
            $img,          // s
            $id            // i
        );
    } else {
        // Atualizar SEM nova imagem
        $sql = "UPDATE items 
                SET name = ?, 
                    description = ?, 
                    importance = ?, 
                    price = ?, 
                    weight = ?, 
                    acquisition_date = ?, 
                    franchise = ?
                WHERE id_item = ?";
        $stmt = $db->prepare($sql);

        if (!$stmt) {
            die("Erro SQL (prepare sem imagem): " . $db->error);
        }

        $stmt->bind_param(
            "ssiddssi",
            $name,         // s
            $description,  // s
            $rating,       // i
            $price,        // d
            $weight,       // d
            $date,         // s
            $franchise,    // s
            $id            // i
        );
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