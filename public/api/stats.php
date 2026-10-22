<?php
// public/api/stats.php - Admin Telemetry & Activity Metrics
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/config.php';
swiftgst_cors('GET, OPTIONS', 'Content-Type, Authorization, X-Requested-With');
require_once __DIR__ . '/db.php';

$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (!$authHeader && function_exists('apache_request_headers')) {
    $headers = apache_request_headers();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
}
if (!$authHeader && function_exists('getallheaders')) {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
}

$adminKey = '';
if (preg_match('/Bearer\s+(\S+)/i', $authHeader, $matches)) {
    $adminKey = $matches[1];
}

// Admin key comes from the server-side .env (ADMIN_KEY); never hardcode it here.
$expectedKey = swiftgst_env('ADMIN_KEY');
if ($expectedKey === '' || $adminKey === '' || !hash_equals($expectedKey, $adminKey)) {
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
    $totalPdfTools = $pdo->query("SELECT COUNT(*) FROM activity_logs WHERE feature_used = 'pdf_tools' OR feature_used LIKE 'pdf_%'")->fetchColumn();

    // 3. Activity Logs (Supports optional ?date=YYYY-MM-DD filter, default latest 300)
    $filterDate = !empty($_GET['date']) ? trim($_GET['date']) : null;
    if ($filterDate && preg_match('/^\d{4}-\d{2}-\d{2}$/', $filterDate)) {
        $logsStmt = $pdo->prepare("SELECT * FROM activity_logs WHERE DATE(created_at) = ? ORDER BY created_at DESC LIMIT 300");
        $logsStmt->execute([$filterDate]);
    } else {
        $logsStmt = $pdo->query("SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 300");
    }
    $recentLogs = $logsStmt->fetchAll();

    echo json_encode([
        "status" => "success",
        "data" => [
            "metrics" => [
                "todayUniqueVisitors" => (int)$uniqueCount,
                "todayPageHits" => (int)$hitCount,
                "totalStores" => (int)$totalStores,
                "publicInvoices" => (int)$totalInvoices,
                "posBills" => (int)$totalPosBills,
                "pdfTools" => (int)$totalPdfTools
            ],
            "logs" => $recentLogs
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Query failed: " . $e->getMessage()]);
}
