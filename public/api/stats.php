<?php
// public/api/stats.php - Admin Telemetry & Activity Metrics
require_once 'db.php';
header('Content-Type: application/json');

$adminKey = $_GET['key'] ?? '';
// Secret Admin Key
if ($adminKey !== 'swift_master_2026') {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

try {
    // 1. Total Registered Stores
    $totalStores = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();

    // 2. Activity Aggregates
    $totalInvoices = $pdo->query("SELECT COUNT(*) FROM activity_logs WHERE feature_used = 'public_invoice'")->fetchColumn();
    $totalPosBills = $pdo->query("SELECT COUNT(*) FROM activity_logs WHERE feature_used = 'pos_counter'")->fetchColumn();

    // 3. Recent 50 Live Activities
    $logsStmt = $pdo->query("SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 50");
    $recentLogs = $logsStmt->fetchAll();

    echo json_encode([
        "status" => "success",
        "data" => [
            "metrics" => [
                "totalStores" => (int)$totalStores,
                "publicInvoices" => (int)$totalInvoices,
                "posBills" => (int)$totalPosBills
            ],
            "logs" => $recentLogs
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Query failed: " . $e->getMessage()]);
}
