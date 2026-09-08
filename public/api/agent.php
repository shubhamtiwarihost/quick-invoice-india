<?php
// public/api/agent.php - SwiftGST AI Merchant Co-Pilot Gateway (PHP / Hostinger)
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 1. Rate Limiting (File-based IP tracking for Apache/PHP)
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
$ip = explode(',', $ip)[0];
$ipHash = md5($ip);
$rateFile = sys_get_temp_dir() . '/swiftgst_rate_' . $ipHash . '.json';

$now = time();
$rateData = ['count' => 0, 'reset' => $now + 60];
if (file_exists($rateFile)) {
    $content = @file_get_contents($rateFile);
    if ($content) {
        $decoded = json_decode($content, true);
        if (is_array($decoded) && isset($decoded['reset']) && $now < $decoded['reset']) {
            $rateData = $decoded;
        }
    }
}

if ($rateData['count'] >= 10) {
    http_response_code(429);
    echo json_encode([
        'error' => 'Rate limit exceeded',
        'message' => 'Aap bohot jaldi queries bhej rahe hain. Free quota bachaane ke liye kripya 1 minute rukiye.',
        'quotaExceeded' => false
    ]);
    exit;
}

$rateData['count']++;
@file_put_contents($rateFile, json_encode($rateData));

$input = json_decode(file_get_contents('php://input'), true);
$prompt = trim($input['prompt'] ?? '');

if (empty($prompt)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing prompt', 'message' => 'Kripya apna sawal ya command likhiye.']);
    exit;
}

$apiKey = getenv('GEMINI_API_KEY') ?: '';

function localFallback($p) {
    $lower = strtolower($p);
    if (strpos($lower, 'bill') !== false || strpos($lower, 'parchi') !== false || strpos($lower, 'kaat') !== false) {
        return [
            'text' => 'Bill draft taiyar hai. POS counter me add kar diya gaya hai.',
            'functionCall' => [
                'name' => 'pos_action',
                'args' => ['action' => 'create_bill', 'items' => [['name' => $p, 'quantity' => 1]]]
            ]
        ];
    }
    if (strpos($lower, 'stock') !== false || strpos($lower, 'khatam') !== false || strpos($lower, 'maal') !== false) {
        return [
            'text' => 'Inventory low-stock items check kiye ja rahe hain.',
            'functionCall' => [
                'name' => 'inventory_action',
                'args' => ['action' => 'check_low_stock']
            ]
        ];
    }
    if (strpos($lower, 'khata') !== false || strpos($lower, 'udhar') !== false || strpos($lower, 'balance') !== false) {
        return [
            'text' => 'Customer ka Khata balance check kiya ja raha hai.',
            'functionCall' => [
                'name' => 'khata_action',
                'args' => ['action' => 'get_balance', 'customer_name' => $p]
            ]
        ];
    }
    if (strpos($lower, 'sale') !== false || strpos($lower, 'bikri') !== false || strpos($lower, 'hisab') !== false) {
        return [
            'text' => 'Aaj ki total bikri aur sales report calculate ho rahi hai.',
            'functionCall' => [
                'name' => 'reports_action',
                'args' => ['action' => 'daily_sales', 'date_range' => 'today']
            ]
        ];
    }
    return [
        'text' => 'Namaste! Main SwiftGST AI Co-Pilot hoon. Aap mujhse bol kar ya likh kar bill bana sakte hain, stock check kar sakte hain, ya customer ka khata dekh sakte hain.',
        'functionCall' => null
    ];
}

if (empty($apiKey)) {
    $fb = localFallback($prompt);
    echo json_encode([
        'success' => true,
        'source' => 'local_fallback',
        'text' => $fb['text'],
        'functionCall' => $fb['functionCall']
    ]);
    exit;
}

// Call Google Gemini API
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . urlencode($apiKey);
$payload = [
    'system_instruction' => [
        'parts' => [['text' => 'You are SwiftGST AI Co-Pilot. Interpret Hindi/Hinglish/English store queries accurately. Call matching functions with validated parameters. Return concise, shopkeeper-friendly responses.']]
    ],
    'contents' => [
        ['role' => 'user', 'parts' => [['text' => $prompt]]]
    ],
    'generationConfig' => [
        'temperature' => 0.2,
        'maxOutputTokens' => 800
    ]
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_TIMEOUT, 12);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 429) {
    echo json_encode([
        'success' => true,
        'quotaExceeded' => true,
        'text' => 'Aaj ka AI free quota pura ho gaya hai. Kal subah reset hoga. Manual billing aur khata smoothly chalu hai.',
        'functionCall' => null
    ]);
    exit;
}

$data = json_decode($response, true);
if ($httpCode !== 200 || empty($data['candidates'])) {
    $fb = localFallback($prompt);
    echo json_encode([
        'success' => true,
        'source' => 'error_fallback',
        'text' => $fb['text'],
        'functionCall' => $fb['functionCall']
    ]);
    exit;
}

$candidate = $data['candidates'][0] ?? null;
$parts = $candidate['content']['parts'] ?? [];
$reply = '';
$fnCall = null;
foreach ($parts as $p) {
    if (!empty($p['text'])) $reply .= $p['text'];
    if (!empty($p['functionCall'])) $fnCall = $p['functionCall'];
}

echo json_encode([
    'success' => true,
    'source' => 'gemini_1.5_flash',
    'text' => trim($reply),
    'functionCall' => $fnCall
]);
