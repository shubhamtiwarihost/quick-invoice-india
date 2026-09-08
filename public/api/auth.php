<?php
/**
 * Authentication API Endpoint for SwiftGST / Quick Invoice India
 * Handles: register, login, me (session validation), and logout
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// 1. Handle CORS preflight early
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 2. Load DB connection
require_once __DIR__ . '/db.php';

// 3. Helper to extract Bearer / Token from headers or payload
function getAuthToken(array $input = []): ?string {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!$authHeader && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }
    if (preg_match('/Bearer\s+(\S+)/i', $authHeader, $matches)) {
        return $matches[1];
    }
    if (!empty($input['token'])) {
        return trim($input['token']);
    }
    if (!empty($_GET['token'])) {
        return trim($_GET['token']);
    }
    return null;
}

// 4. Parse incoming payload
$action = $_GET['action'] ?? '';
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);
if (!is_array($input)) {
    $input = $_POST ?: [];
}

try {
    // ----------------------------------------------------
    // ACTION: REGISTER
    // ----------------------------------------------------
    if ($action === 'register') {
        $businessName = trim($input['businessName'] ?? '');
        $ownerName    = trim($input['ownerName'] ?? '');
        $email        = strtolower(trim($input['email'] ?? ''));
        $password     = $input['password'] ?? '';
        $phone        = trim($input['phone'] ?? '');
        $storeType    = trim($input['storeType'] ?? 'retail');
        $cashierPin   = trim($input['cashierPin'] ?? '1234');

        if (!$businessName || !$email || !$password) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Mandatory fields missing: businessName, email, and password are required."]);
            exit;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Please provide a valid email address."]);
            exit;
        }

        if (strlen($password) < 6) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Password must be at least 6 characters long."]);
            exit;
        }

        // Check if user already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(["status" => "error", "message" => "An account with this email already exists."]);
            exit;
        }

        $userId  = 'usr_' . bin2hex(random_bytes(8));
        $hash    = password_hash($password, PASSWORD_BCRYPT);
        $token   = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', time() + (30 * 24 * 60 * 60)); // 30 days valid

        // Insert new user record
        $insertUser = $pdo->prepare("
            INSERT INTO users (id, business_name, owner_name, email, phone, password_hash, store_type, cashier_pin) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $insertUser->execute([$userId, $businessName, $ownerName, $email, $phone, $hash, $storeType, $cashierPin]);

        // Create active session
        $sessId = 'sess_' . bin2hex(random_bytes(8));
        $insertSession = $pdo->prepare("INSERT INTO user_sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)");
        $insertSession->execute([$sessId, $userId, $token, $expires]);

        echo json_encode([
            "status" => "success",
            "token"  => $token,
            "user"   => [
                "id"           => $userId,
                "businessName" => $businessName,
                "ownerName"    => $ownerName,
                "email"        => $email,
                "phone"        => $phone,
                "storeType"    => $storeType,
                "cashierPin"   => $cashierPin
            ]
        ]);
        exit;
    }

    // ----------------------------------------------------
    // ACTION: LOGIN
    // ----------------------------------------------------
    if ($action === 'login') {
        $email    = strtolower(trim($input['email'] ?? ''));
        $password = $input['password'] ?? '';

        if (!$email || !$password) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Both email and password are required."]);
            exit;
        }

        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($password, $user['password_hash'])) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Invalid email or password."]);
            exit;
        }

        $token   = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', time() + (30 * 24 * 60 * 60)); // 30 days valid

        $sessId = 'sess_' . bin2hex(random_bytes(8));
        $insertSession = $pdo->prepare("INSERT INTO user_sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)");
        $insertSession->execute([$sessId, $user['id'], $token, $expires]);

        echo json_encode([
            "status" => "success",
            "token"  => $token,
            "user"   => [
                "id"           => $user['id'],
                "businessName" => $user['business_name'],
                "ownerName"    => $user['owner_name'],
                "email"        => $user['email'],
                "phone"        => $user['phone'] ?? '',
                "storeType"    => $user['store_type'] ?? 'retail',
                "cashierPin"   => $user['cashier_pin'] ?? '1234'
            ]
        ]);
        exit;
    }

    // ----------------------------------------------------
    // ACTION: ME (Verify current session)
    // ----------------------------------------------------
    if ($action === 'me') {
        $token = getAuthToken($input);
        if (!$token) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Authentication token missing."]);
            exit;
        }

        $stmt = $pdo->prepare("
            SELECT u.id, u.business_name, u.owner_name, u.email, u.phone, u.store_type, u.cashier_pin
            FROM users u
            JOIN user_sessions s ON u.id = s.user_id
            WHERE s.token = ? AND s.expires_at > NOW()
            LIMIT 1
        ");
        $stmt->execute([$token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Invalid or expired session."]);
            exit;
        }

        echo json_encode([
            "status" => "success",
            "user"   => [
                "id"           => $user['id'],
                "businessName" => $user['business_name'],
                "ownerName"    => $user['owner_name'],
                "email"        => $user['email'],
                "phone"        => $user['phone'] ?? '',
                "storeType"    => $user['store_type'] ?? 'retail',
                "cashierPin"   => $user['cashier_pin'] ?? '1234'
            ]
        ]);
        exit;
    }

    // ----------------------------------------------------
    // ACTION: LOGOUT
    // ----------------------------------------------------
    if ($action === 'logout') {
        $token = getAuthToken($input);
        if ($token) {
            $stmt = $pdo->prepare("DELETE FROM user_sessions WHERE token = ?");
            $stmt->execute([$token]);
        }
        echo json_encode(["status" => "success", "message" => "Logged out successfully."]);
        exit;
    }

    // Fallthrough: Action unrecognized
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Invalid or missing action parameter. Expected: 'register', 'login', 'me', or 'logout'."
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}
