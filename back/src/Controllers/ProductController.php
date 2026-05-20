<?php

namespace App\Controllers;

use App\Repositories\ProductRepository;

class ProductController
{
  private $productRepository;
  public function __construct(ProductRepository $productRepository) {
    $this->productRepository = $productRepository;
  }
  public function index(): void
  {
    $products = $this->productRepository->index();
    echo json_encode($products);
  }

  public function getOptions(): void
  {
    $options = $this->productRepository->getOptions();
    echo json_encode($options);
  }

  public function store($data): void
  {
    $data = json_decode(file_get_contents('php://input'), true);
    $product = $this->productRepository->create($data);
    http_response_code(201);
    echo json_encode($product);
  }
}