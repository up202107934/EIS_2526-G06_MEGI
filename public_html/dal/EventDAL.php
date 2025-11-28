<?php
require_once __DIR__ . "/../config/db.php";

class EventDAL {

    // LISTAR TODOS OS EVENTOS
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

    // IR BUSCAR EVENTO POR ID
    public static function getById($id_event) {
        $db = DB::conn();
        $stmt = $db->prepare("SELECT * FROM events WHERE id_event = ?");
        $stmt->bind_param("i", $id_event);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // EVENTOS DE UMA COLEÇÃO (se precisares)
    public static function getByCollection($id_collection) {
        $db = DB::conn();
        $stmt = $db->prepare("
            SELECT e.*
            FROM event_collections ec
            JOIN events e ON e.id_event = ec.id_event
            WHERE ec.id_collection = ?
            ORDER BY e.event_date ASC
        ");
        $stmt->bind_param("i", $id_collection);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    // CRIAR EVENTO
    public static function create($name, $event_date, $description, $location) {
        $db = DB::conn();

        // atenção aos nomes das colunas: têm de bater certo com a tua BD!
        $stmt = $db->prepare("
            INSERT INTO events (name, event_date, description, location)
            VALUES (?, ?, ?, ?)
        ");

        if (!$stmt) {
            // devolve erro claro para o controller
            return ["ok" => false, "error" => $db->error];
        }

        $stmt->bind_param("ssss", $name, $event_date, $description, $location);

        if (!$stmt->execute()) {
            return ["ok" => false, "error" => $stmt->error];
        }

        return ["ok" => true, "id_event" => $stmt->insert_id];
    }
}
