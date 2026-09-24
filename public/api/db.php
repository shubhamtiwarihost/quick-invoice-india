<?php
/**
 * Database connection setup for SwiftGST / Quick Invoice India
 * Credentials come only from the server environment or the server-side .env
 * file (see swiftgst_env in config.php) — never hardcode them here.
 */

require_once __DIR__ . '/config.php';

$dbHost = swiftgst_env('DB_HOST', 'localhost');
$dbPort = intval(swiftgst_env('DB_PORT', '3306'));
$dbName = swiftgst_env('DB_NAME');
$dbUser = swiftgst_env('DB_USER');
$dbPass = swiftgst_env('DB_PASS');

if ($dbName === '' || $dbUser === '' || $dbPass === '') {
    error_log('SwiftGST: database credentials missing (set DB_NAME, DB_USER, DB_PASS in the server .env)');
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Server configuration error. Please try again later."]);
    exit;
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
            visitor_hash VARCHAR(64) NOT NULL DEFAULT '',
            ip_address VARCHAR(45) NOT NULL DEFAULT '',
            visit_date DATE NOT NULL,
            page_path VARCHAR(255) NOT NULL DEFAULT '/',
            hit_count INT DEFAULT 1,
            user_agent VARCHAR(255) DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY uq_date_visitor (visit_date, visitor_hash),
            INDEX idx_daily_visitors_date (visit_date)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // Auto-migration if daily_visitors table was created in an earlier session
    try {
        $pdo->exec("ALTER TABLE daily_visitors ADD COLUMN visitor_hash VARCHAR(64) NOT NULL DEFAULT '' AFTER id");
    } catch (Exception $e) {}
    try {
        $pdo->exec("ALTER TABLE daily_visitors ADD COLUMN page_path VARCHAR(255) NOT NULL DEFAULT '/' AFTER visit_date");
    } catch (Exception $e) {}
    try {
        $pdo->exec("ALTER TABLE daily_visitors ADD UNIQUE KEY uq_date_visitor (visit_date, visitor_hash)");
    } catch (Exception $e) {}

} catch (PDOException $e) {
    error_log('SwiftGST: database connection failed: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database connection failed. Please try again later."
    ]);
    exit;
}
