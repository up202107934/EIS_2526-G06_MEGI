<?php
require_once __DIR__ . "/../config/db.php";

class ReviewDAL {

    // valida se user foi ao evento e coleção está no evento
    public static function canReview($id_user, $id_event, $id_collection) {
        $db = DB::conn();

        // user foi ao evento?
        $stmt1 = $db->prepare("
            SELECT 1 FROM user_events_went 
            WHERE id_user=? AND id_event=?
        ");
        $stmt1->bind_param("ii", $id_user, $id_event);
        $stmt1->execute();
        if (!$stmt1->get_result()->num_rows) return false;

        // coleção está no evento?
        $stmt2 = $db->prepare("
            SELECT 1 FROM event_collections
            WHERE id_event=? AND id_collection=?
        ");
        $stmt2->bind_param("ii", $id_event, $id_collection);
        $stmt2->execute();
        if (!$stmt2->get_result()->num_rows) return false;

        return true;
    }

    public static function create($id_user, $data) {
        $db = DB::conn();

        $id_event = (int)($data["id_event"] ?? 0);
        $id_collection = (int)($data["id_collection"] ?? 0);
        $rate = (int)($data["rate"] ?? 0);
        $comment = $data["comment"] ?? null;

        if (!self::canReview($id_user, $id_event, $id_collection)) return false;

        $stmt = $db->prepare("
            INSERT INTO collection_event_reviews
              (id_user, id_event, id_collection, rate, comment)
            VALUES (?,?,?,?,?)
        ");
        $stmt->bind_param("iiiis", $id_user, $id_event, $id_collection, $rate, $comment);
        return $stmt->execute();
    }

    public static function getByCollectionEvent($id_event, $id_collection) {
        $db = DB::conn();
        $stmt = $db->prepare("
            SELECT r.*, u.username
            FROM collection_event_reviews r
            JOIN users u ON u.id_user=r.id_user
            WHERE r.id_event=? AND r.id_collection=?
            ORDER BY r.review_date DESC
        ");
        $stmt->bind_param("ii", $id_event, $id_collection);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
}
