<?php
require_once __DIR__ . "/../config/db.php";

class EventCollectionsDAL {

  public static function getCollectionsOfEvent($id_event){
    $db = DB::conn();
    $stmt = $db->prepare("
      SELECT c.id_collection, c.name
      FROM event_collections ec
      JOIN collections c ON c.id_collection = ec.id_collection
      WHERE ec.id_event=?
    ");
    $stmt->bind_param("i", $id_event);
    $stmt->execute();
    return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
  }
}
