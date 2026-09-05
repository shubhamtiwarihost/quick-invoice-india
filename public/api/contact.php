<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$subject = trim($input['subject'] ?? '');
$message = trim($input['message'] ?? '');

if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required (name, email, subject, message).']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address provided.']);
    exit;
}

// Read configuration from environment variables or .env file
$smtpHost = getenv('SMTP_HOST') ?: 'smtp.hostinger.com';
$smtpPort = intval(getenv('SMTP_PORT') ?: 465);
$smtpUser = getenv('SMTP_USER') ?: 'contact@swiftgst.in';
$smtpPass = getenv('SMTP_PASS') ?: '';

// Check .env file in root or parent if present
$envFile = __DIR__ . '/../.env';
if (!file_exists($envFile)) {
    $envFile = dirname(__DIR__, 2) . '/.env';
}
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($k, $v) = array_pad(explode('=', $line, 2), 2, null);
        if ($k && $v) {
            $k = trim($k);
            $v = trim(trim($v), '"\'');
            if ($k === 'SMTP_HOST' && empty(getenv('SMTP_HOST'))) $smtpHost = $v;
            if ($k === 'SMTP_PORT' && empty(getenv('SMTP_PORT'))) $smtpPort = intval($v);
            if ($k === 'SMTP_USER' && empty(getenv('SMTP_USER'))) $smtpUser = $v;
            if ($k === 'SMTP_PASS' && empty(getenv('SMTP_PASS'))) $smtpPass = $v;
        }
    }
}

// Function to send email via SMTP socket SSL
function sendHostingerSMTP($host, $port, $user, $pass, $fromEmail, $fromName, $to, $replyTo, $subject, $bodyHtml, $bodyText) {
    $timeout = 20;
    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        ]
    ]);

    $protocol = ($port == 465) ? 'ssl://' : 'tcp://';
    $socket = @stream_socket_client($protocol . $host . ':' . $port, $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $context);
    if (!$socket) {
        throw new Exception("Could not connect to SMTP server $host:$port - $errstr ($errno)");
    }

    $read = function() use ($socket) {
        $response = '';
        while ($line = fgets($socket, 515)) {
            $response .= $line;
            if (substr($line, 3, 1) === ' ') break;
        }
        return $response;
    };

    $send = function($cmd) use ($socket, $read) {
        fputs($socket, $cmd . "\r\n");
        $resp = $read();
        $code = substr($resp, 0, 3);
        if ($code >= 400) {
            throw new Exception("SMTP Error ($code): $resp to command: " . (strpos($cmd, 'AUTH') !== false ? 'AUTH ...' : $cmd));
        }
        return $resp;
    };

    $read(); // Initial greeting
    $send("EHLO " . gethostname());

    if (!empty($user) && !empty($pass)) {
        $send("AUTH LOGIN");
        $send(base64_encode($user));
        $send(base64_encode($pass));
    }

    $send("MAIL FROM: <$fromEmail>");
    $send("RCPT TO: <$to>");
    $send("DATA");

    $boundary = md5(time());
    $headers = [
        "From: =?UTF-8?B?" . base64_encode($fromName) . "?= <$fromEmail>",
        "To: <$to>",
        "Reply-To: <$replyTo>",
        "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=",
        "MIME-Version: 1.0",
        "Content-Type: multipart/alternative; boundary=\"$boundary\"",
        "Date: " . date('r'),
        "X-Mailer: SwiftGST Contact Mailer"
    ];

    $emailContent = implode("\r\n", $headers) . "\r\n\r\n";
    $emailContent .= "--$boundary\r\n";
    $emailContent .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n";
    $emailContent .= $bodyText . "\r\n\r\n";
    $emailContent .= "--$boundary\r\n";
    $emailContent .= "Content-Type: text/html; charset=UTF-8\r\n\r\n";
    $emailContent .= $bodyHtml . "\r\n\r\n";
    $emailContent .= "--$boundary--\r\n.";

    $send($emailContent);
    $send("QUIT");
    fclose($socket);
    return true;
}

$bodyHtml = "
<div style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;\">
  <h2 style=\"color: #0f766e; margin-top: 0; font-size: 20px;\">New Contact Form Message</h2>
  <table style=\"width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;\">
    <tr><td style=\"padding: 6px 0; font-weight: 600; width: 90px; color: #64748b;\">From:</td><td><strong>" . htmlspecialchars($name) . "</strong></td></tr>
    <tr><td style=\"padding: 6px 0; font-weight: 600; width: 90px; color: #64748b;\">Email:</td><td><a href=\"mailto:" . htmlspecialchars($email) . "\" style=\"color: #0f766e;\">" . htmlspecialchars($email) . "</a></td></tr>
    <tr><td style=\"padding: 6px 0; font-weight: 600; width: 90px; color: #64748b;\">Subject:</td><td>" . htmlspecialchars($subject) . "</td></tr>
  </table>
  <div style=\"border-top: 1px solid #e2e8f0; padding-top: 16px;\">
    <p style=\"font-weight: 600; color: #64748b; margin-bottom: 8px; font-size: 14px;\">Message Body:</p>
    <div style=\"background-color: #f8fafc; border: 1px solid #f1f5f9; padding: 16px; border-radius: 8px; white-space: pre-wrap; font-size: 14px; color: #334155;\">" . htmlspecialchars($message) . "</div>
  </div>
  <p style=\"font-size: 12px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px;\">
    Delivered directly to Hostinger Webmail ($smtpUser) via SwiftGST contact form.
  </p>
</div>";

$bodyText = "New contact form message from $name ($email):\n\nSubject: $subject\n\nMessage:\n$message";

try {
    if (!empty($smtpPass)) {
        sendHostingerSMTP($smtpHost, $smtpPort, $smtpUser, $smtpPass, $smtpUser, "SwiftGST Contact Form", $smtpUser, $email, "[SwiftGST Contact] $subject", $bodyHtml, $bodyText);
    } else {
        // Fallback to PHP native mail() if SMTP_PASS not set
        $headers = [
            'From' => "SwiftGST Contact Form <$smtpUser>",
            'Reply-To' => $email,
            'MIME-Version' => '1.0',
            'Content-type' => 'text/html; charset=UTF-8'
        ];
        $sent = mail($smtpUser, "[SwiftGST Contact] $subject", $bodyHtml, $headers);
        if (!$sent) {
            throw new Exception("Hostinger mail delivery failed. Please configure SMTP_PASS.");
        }
    }

    echo json_encode(['success' => true, 'message' => 'Message successfully sent to Hostinger Webmail']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'code' => 'SMTP_DELIVERY_ERROR'
    ]);
}
