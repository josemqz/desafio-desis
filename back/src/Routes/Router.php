<?php

namespace App\Routes;
use App\Controllers\ProductController;

class Router {
  private $productController;
  public function __construct(ProductController $productController) {
    $this->productController = $productController;
  }

  public function route($method, $path) {
    if (strpos($path, '/api/products') === false) {
      http_response_code(404);
      echo json_encode(['error' => 'Not Found']);
      return;
    }
    if ($method === 'GET' && preg_match('#^/api/products/?$#', $path)) {
        $this->productController->index();
        return;
    } else if ($method === 'GET' && preg_match('#^/api/products/options$#', $path)) {
        $this->productController->getOptions();
        return;
    } else if ($method === 'POST' && preg_match('#^/api/products/?$#', $path)) {
        $data = json_decode(file_get_contents('php://input'), true);
        // echo json_encode(['message' => 'Data received', 'data' => $data]);
        $this->productController->store($data);
        return;
    }
  
    http_response_code(404);
    echo json_encode(['error' => 'Not Found']);
  }
}