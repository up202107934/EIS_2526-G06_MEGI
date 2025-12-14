<?php
require_once __DIR__ . '/../partials/bootstrap.php';

header('Content-Type: application/json');

if (!isset($_SESSION['id_user'])) {
    echo json_encode(['ok' => false, 'error' => 'not_logged']);
    exit;
}

$db = DB::conn();
$userId = (int) $_SESSION['id_user'];

$method = $_SERVER['REQUEST_METHOD'];

function fetchWishlistId(mysqli $db, int $userId): ?int {
    $stmt = $db->prepare('SELECT id_wishlist FROM wishlists WHERE id_user = ? LIMIT 1');
    if (!$stmt) {
        return null;
    }
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $res = $stmt->get_result()->fetch_assoc();
    return $res ? (int) $res['id_wishlist'] : null;
}

function countWishlistsWithItem(mysqli $db, int $itemId): int {
    $stmt = $db->prepare('SELECT COUNT(DISTINCT id_wishlist) AS total FROM wishlist_items WHERE id_item = ?');
    $stmt->bind_param('i', $itemId);
    $stmt->execute();
    $res = $stmt->get_result()->fetch_assoc();
    return (int) ($res['total'] ?? 0);
}

if ($method === 'GET') {
    $itemId = isset($_GET['id_item']) ? (int) $_GET['id_item'] : 0;
    if ($itemId <= 0) {
        echo json_encode(['ok' => false, 'error' => 'invalid_item']);
        exit;
    }

    $wishlistId = fetchWishlistId($db, $userId);
    if (!$wishlistId) {
        echo json_encode(['ok' => false, 'error' => 'wishlist_not_found']);
        exit;
    }

    $checkStmt = $db->prepare('SELECT 1 FROM wishlist_items WHERE id_wishlist = ? AND id_item = ? LIMIT 1');
    $checkStmt->bind_param('ii', $wishlistId, $itemId);
    $checkStmt->execute();
    $inWishlist = (bool) $checkStmt->get_result()->fetch_assoc();

    echo json_encode([
        'ok' => true,
        'in_wishlist' => $inWishlist,
        'total_wishlists' => countWishlistsWithItem($db, $itemId),
    ]);
    exit;
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $itemId = isset($data['id_item']) ? (int) $data['id_item'] : 0;
    $action = $data['action'] ?? '';

    if ($itemId <= 0) {
        echo json_encode(['ok' => false, 'error' => 'invalid_item']);
        exit;
    }

    $wishlistId = fetchWishlistId($db, $userId);
    if (!$wishlistId) {
        echo json_encode(['ok' => false, 'error' => 'wishlist_not_found']);
        exit;
    }
    $wishlistId = fetchWishlistId($db, $userId);

    if (!$wishlistId) {
        // Se não encontrar, criamos uma wishlist para o utilizador automaticamente
        $createStmt = $db->prepare('INSERT INTO wishlists (id_user, name) VALUES (?, "My Wishlist")');
        $createStmt->bind_param('i', $userId);
        $createStmt->execute();
        $wishlistId = $db->insert_id;
    }

    if ($action === 'add') {
        $checkStmt = $db->prepare('SELECT 1 FROM wishlist_items WHERE id_wishlist = ? AND id_item = ? LIMIT 1');
        $checkStmt->bind_param('ii', $wishlistId, $itemId);
        $checkStmt->execute();

        if (!$checkStmt->get_result()->fetch_assoc()) {
            $insertStmt = $db->prepare('INSERT INTO wishlist_items (id_wishlist, id_item, added_at) VALUES (?, ?, NOW())');
            if (!$insertStmt) {
                echo json_encode(['ok' => false, 'error' => 'db_prepare']);
                exit;
            }
            $insertStmt->bind_param('ii', $wishlistId, $itemId);
            $insertStmt->execute();
        }
    } elseif ($action === 'remove') {
        $deleteStmt = $db->prepare('DELETE FROM wishlist_items WHERE id_wishlist = ? AND id_item = ?');
        if (!$deleteStmt) {
            echo json_encode(['ok' => false, 'error' => 'db_prepare']);
            exit;
        }
        $deleteStmt->bind_param('ii', $wishlistId, $itemId);
        $deleteStmt->execute();
    } else {
        echo json_encode(['ok' => false, 'error' => 'invalid_action']);
        exit;
    }

    echo json_encode([
        'ok' => true,
        'in_wishlist' => $action === 'add',
        'total_wishlists' => countWishlistsWithItem($db, $itemId),
    ]);
    exit;
}

echo json_encode(['ok' => false, 'error' => 'unsupported_method']);
