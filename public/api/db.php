<?php
/**
 * Database connection setup for SwiftGST / Quick Invoice India
 * Compatible with Apache & Hostinger MySQL
 */

// Read configuration from environment variables or .env file
$dbHost = getenv('DB_HOST') ?: 'localhost';
$dbPort = intval(getenv('DB_PORT') ?: 3306);
$dbName = getenv('DB_NAME') ?: '';
$dbUser = getenv('DB_USER') ?: '';
$dbPass = getenv('DB_PASS') ?: '';

// Check .env file in public parent or project root
$envFile = __DIR__ . '/../.env';
if (!file_exists($envFile)) {
    $envFile = dirname(__DIR__, 2) . '/.env';
}

if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if (strpos($line, '#') === 0 || empty($line)) continue;
        list($k, $v) = array_pad(explode('=', $line, 2), 2, null);
        if ($k && $v !== null) {
            $k = trim($k);
            $v = trim(trim($v), '"\'');
            if ($k === 'DB_HOST' && empty(getenv('DB_HOST'))) $dbHost = $v;
            if ($k === 'DB_PORT' && empty(getenv('DB_PORT'))) $dbPort = intval($v);
            if ($k === 'DB_NAME' && empty(getenv('DB_NAME'))) $dbName = $v;
            if ($k === 'DB_USER' && empty(getenv('DB_USER'))) $dbUser = $v;
            if ($k === 'DB_PASS' && empty(getenv('DB_PASS'))) $dbPass = $v;
        }
    }
}

if (empty($dbName) || empty($dbUser)) {
    // If not configured yet, return clear error response
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database credentials not configured. Please set DB_NAME, DB_USER, and DB_PASS in your .env file."
    ]);
    exit;
}

$dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $dbUser, $dbPass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database connection failed. Please verify your database settings."
    ]);
    exit;
}
