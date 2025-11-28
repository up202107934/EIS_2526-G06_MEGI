<?php
require_once __DIR__ . "/../dal/EventCollectionsDAL.php";
header("Content-Type: application/json; charset=utf-8");

if (isset($_GET["event"])) {
  echo json_encode(EventCollectionsDAL::getCollectionsOfEvent((int)$_GET["event"]));
  exit;
}

http_response_code(400);
echo json_encode(["error"=>"missing event id"]);
