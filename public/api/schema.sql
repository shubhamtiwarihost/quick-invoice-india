-- SwiftGST / Quick Invoice India Database Schema
-- Run this SQL in phpMyAdmin or your MySQL console

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
