<?php
/**
 * Database connection setup for SwiftGST / Quick Invoice India
 * Connected to Hostinger MySQL Database (u932835494_alpha)
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Default Hostinger Database Credentials
$dbHost = getenv('DB_HOST') ?: 'localhost';
$dbPort = intval(getenv('DB_PORT') ?: 3306);
$dbName = getenv('DB_NAME') ?: 'u932835494_alpha';
$dbUser = getenv('DB_USER') ?: 'u932835494_alpha';
$dbPass = getenv('DB_PASS') ?: 'SwiftGST@2026#Secure';

// Optional: Override via .env file if present
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
            if ($k === 'DB_HOST' && !empty($v)) $dbHost = $v;
            if ($k === 'DB_PORT' && !empty($v)) $dbPort = intval($v);
            if ($k === 'DB_NAME' && !empty($v)) $dbName = $v;
            if ($k === 'DB_USER' && !empty($v)) $dbUser = $v;
            if ($k === 'DB_PASS' && !empty($v)) $dbPass = $v;
        }
    }
}

$dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    try {
        $pdo = new PDO($dsn, $dbUser, $dbPass, $options);
    } catch (PDOException $connErr) {
        // Fallback: On some Hostinger nodes, TCP 127.0.0.1 is required instead of localhost socket
        if ($dbHost === 'localhost') {
            $tcpDsn = "mysql:host=127.0.0.1;port={$dbPort};dbname={$dbName};charset=utf8mb4";
            $pdo = new PDO($tcpDsn, $dbUser, $dbPass, $options);
        } else {
            throw $connErr;
        }
    }

    // Auto-create users and user_sessions tables if they don't exist yet
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(32) PRIMARY KEY,
            business_name VARCHAR(191) NOT NULL,
            owner_name VARCHAR(191) DEFAULT '',
            email VARCHAR(191) NOT NULL UNIQUE,
            phone VARCHAR(32) DEFAULT '',
            password_hash VARCHAR(255) NOT NULL,
            store_type VARCHAR(64) DEFAULT 'retail',
            cashier_pin VARCHAR(10) DEFAULT '1234',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE IF NOT EXISTS user_sessions (
            id VARCHAR(32) PRIMARY KEY,
            user_id VARCHAR(32) NOT NULL,
            token VARCHAR(64) NOT NULL UNIQUE,
            expires_at DATETIME NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_user_sessions_token (token),
            INDEX idx_user_sessions_user_id (user_id),
            CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE IF NOT EXISTS activity_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(32) DEFAULT NULL,
            store_name VARCHAR(191) DEFAULT NULL,
            event_type VARCHAR(64) NOT NULL,
            feature_used VARCHAR(64) DEFAULT 'general',
            details_json TEXT DEFAULT NULL,
            ip_address VARCHAR(45) DEFAULT '',
            user_agent VARCHAR(255) DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_activity_logs_user_id (user_id),
            INDEX idx_activity_logs_event_type (event_type),
            INDEX idx_activity_logs_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        CREATE TABLE IF NOT EXISTS daily_visitors (
            id INT AUTO_INCREMENT PRIMARY KEY,
            visit_date DATE NOT NULL,
            ip_address VARCHAR(45) NOT NULL,
            hit_count INT DEFAULT 1,
            user_agent VARCHAR(255) DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY uq_date_ip (visit_date, ip_address),
            INDEX idx_daily_visitors_date (visit_date)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database connection failed: " . $e->getMessage()
    ]);
    exit;
}
