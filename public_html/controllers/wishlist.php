<?php
require_once __DIR__ . '/../partials/bootstrap.php';

header('Content-Type: application/json');

if (!isset($_SESSION['id_user'])) {
    echo json_encode(['ok' => false, 'error' => 'not_logged']);
    exit;
}

$userId = (int) $_SESSION['id_user'];
$db = DB::conn();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT wi.id_item, wi.added_at, i.name, i.img, i.price, i.weight, i.description,
                   GROUP_CONCAT(DISTINCT c.name ORDER BY c.name SEPARATOR ', ') AS collection_names,
                   MIN(c.id_collection) AS collection_id
            FROM wishlists w
            JOIN wishlist_items wi ON w.id_wishlist = wi.id_wishlist
            JOIN items i ON wi.id_item = i.id_item
            LEFT JOIN collection_items ci ON ci.id_item = i.id_item
            LEFT JOIN collections c ON ci.id_collection = c.id_collection
            WHERE w.id_user = ?
            GROUP BY wi.id_item, wi.added_at, i.name, i.img, i.price, i.weight, i.description
            ORDER BY wi.added_at DESC";

    $stmt = $db->prepare($sql);
    if (!$stmt) {
        echo json_encode(['ok' => false, 'error' => 'db_prepare']);
        exit;
    }

    $stmt->bind_param('i', $userId);
    $stmt->execute();

    $result = $stmt->get_result();
    $items = [];

    while ($row = $result->fetch_assoc()) {
        $items[] = [
            'id_item' => (int) $row['id_item'],
            'name' => $row['name'],
            'img' => $row['img'],
            'price' => $row['price'],
            'weight' => $row['weight'],
            'description' => $row['description'],
            'added_at' => $row['added_at'],
            'collection_names' => $row['collection_names'],
            'collection_id' => $row['collection_id'],
        ];
    }

    echo json_encode(['ok' => true, 'items' => $items]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $idItem = (int) ($data['id_item'] ?? 0);

    if ($idItem <= 0) {
        echo json_encode(['ok' => false, 'error' => 'invalid_item']);
        exit;
    }

    $wishlistStmt = $db->prepare('SELECT id_wishlist FROM wishlists WHERE id_user = ? LIMIT 1');
    if (!$wishlistStmt) {
        echo json_encode(['ok' => false, 'error' => 'db_prepare']);
        exit;
    }

    $wishlistStmt->bind_param('i', $userId);
    $wishlistStmt->execute();
    $wishlistResult = $wishlistStmt->get_result()->fetch_assoc();

    if (!$wishlistResult) {
        echo json_encode(['ok' => false, 'error' => 'wishlist_not_found']);
        exit;
    }

    $wishlistId = (int) $wishlistResult['id_wishlist'];

    $deleteStmt = $db->prepare('DELETE FROM wishlist_items WHERE id_wishlist = ? AND id_item = ?');
    if (!$deleteStmt) {
        echo json_encode(['ok' => false, 'error' => 'db_prepare']);
        exit;
    }

    $deleteStmt->bind_param('ii', $wishlistId, $idItem);
    $success = $deleteStmt->execute();

    echo json_encode(['ok' => $success]);
    exit;
}

echo json_encode(['ok' => false, 'error' => 'unsupported_method']);