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
    $today = date('Y-m-d');

    // 1. Visitor Stats
    $todayUniqueVisitors = $pdo->prepare("SELECT COUNT(*) FROM daily_visitors WHERE visit_date = ?");
    $todayUniqueVisitors->execute([$today]);
    $uniqueCount = $todayUniqueVisitors->fetchColumn();

    $todayHits = $pdo->prepare("SELECT COALESCE(SUM(hit_count), 0) FROM daily_visitors WHERE visit_date = ?");
    $todayHits->execute([$today]);
    $hitCount = $todayHits->fetchColumn();

    // 2. Stores & Billing Metrics
    $totalStores = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    $totalInvoices = $pdo->query("SELECT COUNT(*) FROM activity_logs WHERE feature_used = 'public_invoice'")->fetchColumn();
    $totalPosBills = $pdo->query("SELECT COUNT(*) FROM activity_logs WHERE feature_used = 'pos_counter'")->fetchColumn();

    // 3. Recent Activity Logs
    $logsStmt = $pdo->query("SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 50");
    $recentLogs = $logsStmt->fetchAll();

    echo json_encode([
        "status" => "success",
        "data" => [
            "metrics" => [
                "todayUniqueVisitors" => (int)$uniqueCount,
                "todayPageHits" => (int)$hitCount,
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
