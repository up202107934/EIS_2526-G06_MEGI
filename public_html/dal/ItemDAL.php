<?php
require_once __DIR__ . "/../config/db.php";

class EventDAL {

    // 1) listar todos
    public static function getAll() {
        $db = DB::conn();
        $res = $db->query("
            SELECT *
            FROM events
            ORDER BY event_date ASC
        ");
        if (!$res) return [];
        return $res->fetch_all(MYSQLI_ASSOC);
    }

    // 2) ir buscar por id
    public static function getById($id_event) {
        $db = DB::conn();
        $stmt = $db->prepare("SELECT * FROM events WHERE id_event=?");
        $stmt->bind_param("i", $id_event);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // 3) criar evento
    public static function create($name, $event_date, $description, $location) {
        $db = DB::conn();
        $stmt = $db->prepare("
            INSERT INTO events (name, event_date, description, location)
            VALUES (?, ?, ?, ?)
        ");
        if (!$stmt) {
            return ["ok"=>false, "error"=>$db->error];
        }

        $stmt->bind_param("ssss", $name, $event_date, $description, $location);
        $ok = $stmt->execute();

        if (!$ok) {
            return ["ok"=>false, "error"=>$stmt->error];
        }

        return ["ok"=>true, "id_event"=>$stmt->insert_id];
    }

    // 4) ligar coleções a evento
    public static function addCollectionsToEvent($id_event, $collectionIds) {
        $db = DB::conn();
        $stmt = $db->prepare("
            INSERT INTO event_collections (id_event, id_collection)
            VALUES (?, ?)
        ");

        foreach ($collectionIds as $cid) {
            $cid = (int)$cid;
            $stmt->bind_param("ii", $id_event, $cid);
            $stmt->execute();
        }
    }

    // 5) ligar itens a evento
    public static function addItemsToEvent($id_event, $itemIds) {
        $db = DB::conn();
        $stmt = $db->prepare("
            INSERT IGNORE INTO event_items (id_event, id_item)
            VALUES (?, ?)
        ");

        foreach ($itemIds as $iid) {
            $iid = (int)$iid;
            $stmt->bind_param("ii", $id_event, $iid);
            $stmt->execute();
        }
    }

    // 6) coleções de um evento (detalhe)
    public static function getCollectionsOfEvent($id_event) {
        $db = DB::conn();
        $stmt = $db->prepare("
          SELECT c.*
          FROM event_collections ec
          JOIN collections c ON c.id_collection = ec.id_collection
          WHERE ec.id_event = ?
        ");
        $stmt->bind_param("i", $id_event);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
}
