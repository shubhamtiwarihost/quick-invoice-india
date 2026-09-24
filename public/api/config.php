<?php
/**
 * Shared server config for SwiftGST API endpoints: .env loading and CORS.
 * Secrets live only in a server-side .env file — never in this repository.
 */

/**
 * Read a config value from the real environment, falling back to a .env file.
 * The .env outside the web root (domains/swiftgst.in/.env) takes priority over
 * one inside public_html.
 */
function swiftgst_env(string $key, string $default = ''): string {
    static $fileVars = null;

    $value = getenv($key);
    if ($value !== false && $value !== '') {
        return $value;
    }

    if ($fileVars === null) {
        $fileVars = [];
        $candidates = [
            dirname(__DIR__, 2) . '/.env', // outside web root (preferred)
            dirname(__DIR__) . '/.env',    // public_html/.env (blocked from web by .htaccess)
        ];
        foreach ($candidates as $envFile) {
            if (!is_readable($envFile)) continue;
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $line = trim($line);
                if ($line === '' || strpos($line, '#') === 0) continue;
                list($k, $v) = array_pad(explode('=', $line, 2), 2, null);
                if ($k === null || $v === null) continue;
                $k = trim($k);
                if ($k !== '' && !array_key_exists($k, $fileVars)) {
                    $fileVars[$k] = trim(trim($v), '"\'');
                }
            }
            break;
        }
    }

    return ($fileVars[$key] ?? '') !== '' ? $fileVars[$key] : $default;
}

/**
 * Only allow cross-origin browser requests from the real website.
 * Override with ALLOWED_ORIGINS="https://a.com,https://b.com" in .env if needed.
 * Handles OPTIONS preflight and exits.
 */
function swiftgst_cors(string $methods, string $headers = 'Content-Type, Authorization, X-Requested-With'): void {
    $configured = swiftgst_env('ALLOWED_ORIGINS');
    $allowed = $configured !== ''
        ? array_map('trim', explode(',', $configured))
        : ['https://swiftgst.in', 'https://www.swiftgst.in'];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $originAllowed = $origin !== '' && in_array($origin, $allowed, true);

    header('Vary: Origin');
    if ($originAllowed) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Methods: ' . $methods);
        header('Access-Control-Allow-Headers: ' . $headers);
    }

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code($originAllowed ? 204 : 403);
        exit;
    }
}
