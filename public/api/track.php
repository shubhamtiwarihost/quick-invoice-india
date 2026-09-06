<?php
// public_html/api/track.php
require_once 'db.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['event_type'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing event"]);
    exit;
}

$userId = $input['userId'] ?? null;
$storeName = $input['storeName'] ?? null;
$eventType = $input['event_type'];
$feature = $input['feature'] ?? 'general';
$details = isset($input['details']) ? (is_string($input['details']) ? $input['details'] : json_encode($input['details'])) : null;
$ip = $_SERVER['REMOTE_ADDR'] ?? '';
$agent = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 250);

try {
    // 1. Record / increment daily visitors & page hits
    $today = date('Y-m-d');
    $visStmt = $pdo->prepare("
        INSERT INTO daily_visitors (visit_date, ip_address, hit_count, user_agent)
        VALUES (?, ?, 1, ?)
        ON DUPLICATE KEY UPDATE hit_count = hit_count + 1, updated_at = CURRENT_TIMESTAMP
    ");
    $visStmt->execute([$today, $ip, $agent]);

    // 2. Insert into activity_logs
    $stmt = $pdo->prepare("INSERT INTO activity_logs (user_id, store_name, event_type, feature_used, details_json, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$userId, $storeName, $eventType, $feature, $details, $ip, $agent]);

    echo json_encode(["status" => "success"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Logging failed: " . $e->getMessage()]);
}
