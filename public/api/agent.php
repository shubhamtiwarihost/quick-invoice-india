<?php
// public/api/agent.php - SwiftGST AI Assistant Gateway (PHP / Hostinger Production)
error_reporting(0);
ini_set('display_errors', '0');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
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

if ($rateData['count'] >= 15 && php_sapi_name() !== 'cli') {
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

$rawInput = file_get_contents('php://input');
if (empty($rawInput) && php_sapi_name() === 'cli') {
    $rawInput = file_get_contents('php://stdin');
}
$input = json_decode($rawInput, true);
$prompt = trim($input['prompt'] ?? '');

if (empty($prompt)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing prompt', 'message' => 'Kripya apna sawal ya command likhiye.']);
    exit;
}

// 2. Intelligent Offline Fallback for Local / Network-outage Scenarios
function localFallback($p) {
    $lower = strtolower($p);
    if (strpos($lower, 'bill') !== false || strpos($lower, 'parchi') !== false || strpos($lower, 'kaat') !== false || strpos($lower, 'chalan') !== false) {
        if (strpos($lower, 'hold') !== false || strpos($lower, 'park') !== false || strpos($lower, 'rok') !== false) {
            return [
                'text' => 'Bill ko hold pe daal diya gaya hai. Aap naya bill bana sakte hain.',
                'functionCall' => [
                    'name' => 'pos_action',
                    'args' => ['action' => 'hold_bill']
                ]
            ];
        }
        return [
            'text' => 'Bill draft taiyar hai. POS counter me add kar diya gaya hai.',
            'functionCall' => [
                'name' => 'pos_action',
                'args' => ['action' => 'create_bill', 'items' => [['name' => $p, 'quantity' => 1]]]
            ]
        ];
    }
    if (strpos($lower, 'stock') !== false || strpos($lower, 'khatam') !== false || strpos($lower, 'maal') !== false || strpos($lower, 'inventory') !== false) {
        return [
            'text' => 'Inventory low-stock items check kiye ja rahe hain.',
            'functionCall' => [
                'name' => 'inventory_action',
                'args' => ['action' => 'check_low_stock']
            ]
        ];
    }
    if (strpos($lower, 'khata') !== false || strpos($lower, 'udhar') !== false || strpos($lower, 'balance') !== false || strpos($lower, 'sharma') !== false || strpos($lower, 'verma') !== false) {
        return [
            'text' => 'Customer ka Khata balance check kiya ja raha hai.',
            'functionCall' => [
                'name' => 'khata_action',
                'args' => ['action' => 'get_balance', 'customer_name' => $p]
            ]
        ];
    }
    if (strpos($lower, 'sale') !== false || strpos($lower, 'bikri') !== false || strpos($lower, 'hisab') !== false || strpos($lower, 'report') !== false || strpos($lower, 'gst') !== false) {
        return [
            'text' => 'Aaj ki total bikri aur sales report calculate ho rahi hai.',
            'functionCall' => [
                'name' => 'reports_action',
                'args' => ['action' => 'daily_sales', 'date_range' => 'today']
            ]
        ];
    }
    return [
        'text' => 'Namaste! Main Swift AI Assistant hoon. Aap mujhse bol kar ya likh kar bill bana sakte hain, stock check kar sakte hain, ya customer ka khata hisaab dekh sakte hain.',
        'functionCall' => null
    ];
}

// 3. Resolve Gemini API Key
$apiKey = getenv('GEMINI_API_KEY') ?: 'AQ.Ab8RN6KzdR9dkOlwhJW_vGoB4tBYzSeODJeg_wZcNb16hNc7xA';

$envFiles = [
    __DIR__ . '/../.env',
    dirname(__DIR__, 2) . '/.env',
    dirname(__DIR__, 2) . '/.env.local'
];
foreach ($envFiles as $ef) {
    if (file_exists($ef)) {
        $lines = file($ef, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if (strpos($line, '#') === 0 || empty($line)) continue;
            list($k, $v) = array_pad(explode('=', $line, 2), 2, null);
            if ($k && $v !== null) {
                $k = trim($k);
                $v = trim(trim($v), '"\'');
                if ($k === 'GEMINI_API_KEY' && !empty($v)) {
                    $apiKey = $v;
                    break 2;
                }
            }
        }
    }
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

// 4. Function Declarations for Gemini Tools
$functionDeclarations = [
    [
        'name' => 'pos_action',
        'description' => 'Perform billing and Point-of-Sale actions: create bill, hold bill, search item, or apply discount.',
        'parameters' => [
            'type' => 'OBJECT',
            'properties' => [
                'action' => [
                    'type' => 'STRING',
                    'enum' => ['create_bill', 'hold_bill', 'search_item', 'apply_discount'],
                    'description' => 'Specific POS action to execute'
                ],
                'items' => [
                    'type' => 'ARRAY',
                    'description' => 'List of products/items to add to bill',
                    'items' => [
                        'type' => 'OBJECT',
                        'properties' => [
                            'name' => ['type' => 'STRING', 'description' => 'Product name'],
                            'quantity' => ['type' => 'NUMBER', 'description' => 'Quantity count (default 1)'],
                            'price' => ['type' => 'NUMBER', 'description' => 'Unit price if mentioned']
                        ],
                        'required' => ['name']
                    ]
                ],
                'customer_name' => ['type' => 'STRING', 'description' => 'Customer name'],
                'discount_percent' => ['type' => 'NUMBER', 'description' => 'Discount percentage to apply'],
                'search_query' => ['type' => 'STRING', 'description' => 'Product search term or barcode']
            ],
            'required' => ['action']
        ]
    ],
    [
        'name' => 'inventory_action',
        'description' => 'Manage store stock inventory: check low stock, update quantity, or add new product SKU.',
        'parameters' => [
            'type' => 'OBJECT',
            'properties' => [
                'action' => [
                    'type' => 'STRING',
                    'enum' => ['check_low_stock', 'update_quantity', 'add_product'],
                    'description' => 'Inventory action to perform'
                ],
                'product_name' => ['type' => 'STRING', 'description' => 'Name of the product'],
                'barcode' => ['type' => 'STRING', 'description' => 'Product barcode or SKU'],
                'quantity' => ['type' => 'NUMBER', 'description' => 'Quantity to add or set'],
                'price' => ['type' => 'NUMBER', 'description' => 'Product sale price in INR'],
                'threshold' => ['type' => 'NUMBER', 'description' => 'Low stock alert threshold']
            ],
            'required' => ['action']
        ]
    ],
    [
        'name' => 'khata_action',
        'description' => 'Manage customer Khata & credit ledger: check balance, record credit payment, or prepare WhatsApp reminder link.',
        'parameters' => [
            'type' => 'OBJECT',
            'properties' => [
                'action' => [
                    'type' => 'STRING',
                    'enum' => ['get_balance', 'record_payment', 'prepare_whatsapp_link'],
                    'description' => 'Khata credit action'
                ],
                'customer_name' => ['type' => 'STRING', 'description' => 'Customer name'],
                'customer_phone' => ['type' => 'STRING', 'description' => 'Customer mobile number'],
                'amount' => ['type' => 'NUMBER', 'description' => 'Payment or balance amount in INR'],
                'notes' => ['type' => 'STRING', 'description' => 'Remarks or payment reference']
            ],
            'required' => ['action']
        ]
    ],
    [
        'name' => 'reports_action',
        'description' => 'Calculate store analytics: daily sales, cash vs UPI breakdown, or GST tax summary.',
        'parameters' => [
            'type' => 'OBJECT',
            'properties' => [
                'action' => [
                    'type' => 'STRING',
                    'enum' => ['daily_sales', 'payment_breakdown', 'gst_summary'],
                    'description' => 'Reporting metric to compute'
                ],
                'date_range' => [
                    'type' => 'STRING',
                    'enum' => ['today', 'yesterday', 'this_week', 'this_month'],
                    'description' => 'Time range for calculations'
                ]
            ],
            'required' => ['action']
        ]
    ]
];

$payload = [
    'system_instruction' => [
        'parts' => [['text' => 'You are Swift AI Assistant. Interpret Hindi/Hinglish/English store queries accurately. Call matching functions with validated parameters. Return concise, shopkeeper-friendly responses.']]
    ],
    'contents' => [
        ['role' => 'user', 'parts' => [['text' => $prompt]]]
    ],
    'tools' => [
        ['function_declarations' => $functionDeclarations]
    ],
    'generationConfig' => [
        'temperature' => 0.2,
        'maxOutputTokens' => 800
    ]
];

// 5. Query Gemini API with Fallback Models
$envModel = getenv('GEMINI_MODEL');
$modelsToTry = array_values(array_unique(array_filter([
    $envModel ? trim($envModel) : 'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash'
])));

$successData = null;
$chosenModel = '';

foreach ($modelsToTry as $m) {
    $url = "https://generativelanguage.googleapis.com/v1beta/models/" . urlencode($m) . ":generateContent?key=" . urlencode($apiKey);

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_TIMEOUT, 8);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 4);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    @curl_close($ch);

    if ($httpCode === 429) {
        echo json_encode([
            'success' => true,
            'quotaExceeded' => true,
            'text' => 'Aaj ka AI free quota pura ho gaya hai. Kal subah reset hoga. Manual billing aur khata smoothly chalu hai.',
            'functionCall' => null
        ]);
        exit;
    }

    if ($httpCode === 200 && $response) {
        $parsed = json_decode($response, true);
        if (!empty($parsed['candidates'][0])) {
            $successData = $parsed;
            $chosenModel = $m;
            break;
        }
    }
}

if (!$successData) {
    $fb = localFallback($prompt);
    echo json_encode([
        'success' => true,
        'source' => 'local_fallback',
        'text' => $fb['text'],
        'functionCall' => $fb['functionCall']
    ]);
    exit;
}

$candidate = $successData['candidates'][0] ?? null;
$parts = $candidate['content']['parts'] ?? [];
$reply = '';
$fnCall = null;

foreach ($parts as $p) {
    if (!empty($p['text'])) {
        $reply .= $p['text'];
    }
    if (!empty($p['functionCall'])) {
        $fnCall = $p['functionCall'];
    }
}

// If Gemini returned a functionCall without text, synthesize a helpful message
if ($fnCall && empty(trim($reply))) {
    switch ($fnCall['name']) {
        case 'pos_action':
            $reply = 'POS bill command pehchana gaya. Processing...';
            break;
        case 'inventory_action':
            $reply = 'Inventory stock command pehchana gaya. Processing...';
            break;
        case 'khata_action':
            $reply = 'Customer Khata command pehchana gaya. Processing...';
            break;
        case 'reports_action':
            $reply = 'Sales report calculate ki ja rahi hai. Processing...';
            break;
        default:
            $reply = 'Command pehchana gaya. Processing...';
    }
}

echo json_encode([
    'success' => true,
    'source' => $chosenModel ?: 'gemini_flash',
    'text' => trim($reply),
    'functionCall' => $fnCall
]);
