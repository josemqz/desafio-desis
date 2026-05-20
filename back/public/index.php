<?php

namespace App;

use App\Routes\Router;
use App\Controllers\ProductController;
use App\Repositories\ProductRepository;
use App\Database;

spl_autoload_register(function (string $class) {
    $relative = str_replace(['App\\', '\\'], ['', '/'], $class);
    $path = __DIR__ . '/../src/' . $relative . '.php';
    if (file_exists($path)) {
        require $path;
    }
});

set_exception_handler(function (\Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
    ]);
});

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

set_error_handler(function (int $severity, string $message, string $file, int $line) {
    throw new \ErrorException($message, 0, $severity, $file, $line);
});


// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Router
$method = $_SERVER['REQUEST_METHOD'];
$path = trim(urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)));

$router = new Router(new ProductController(new ProductRepository(new Database())));
$router->route($method, $path);