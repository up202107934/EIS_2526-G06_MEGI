<?php
// Desativar exibição de erros no ecrã para não estragar o JSON
error_reporting(0);
ini_set('display_errors', 0);

header("Content-Type: application/json; charset=utf-8");

try {
    // 1. DADOS DE LIGAÇÃO
    $host = "localhost";
    
    // 👇👇👇 NOME CORRIGIDO AQUI 👇👇👇
    $db   = "colecoesdb"; 
    // 👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆
    
    $user = "root";
    $pass = "";          
    $charset = "utf8mb4";

    // 2. LIGAR À BD
    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, $user, $pass, $options);

    // 3. FAZER A QUERY
    // (Confirma se a tabela se chama 'collection_categories' na tua BD 'colecoesdb')
    $stmt = $pdo->query("SELECT id_collection_category, name FROM collection_categories ORDER BY name ASC");
    $categories = $stmt->fetchAll();

    // 4. ENVIAR RESPOSTA JSON
    echo json_encode($categories);

} catch (Exception $e) {
    // Em caso de erro, envia JSON a explicar
    http_response_code(500);
    echo json_encode([
        "error" => true, 
        "message" => "Erro no servidor: " . $e->getMessage()
    ]);
}
?>