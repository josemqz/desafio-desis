<?php

namespace App\Repositories;

use App\Database;
use App\Models\Product;

class ProductRepository {
  private $products = [];
  private $pdo;

  public function __construct(Database $database) {
    $this->products = [];
    $this->pdo = $database->getConnection();
  }

  public function index(): array {
    $queryFile = __DIR__ . '/../../sql/selectAllProducts.sql';
    if (!file_exists($queryFile)) {
      throw new RuntimeException("Query file not found: $queryFile");
    }
    $query = file_get_contents($queryFile) ?: '';
    $stmt = $this->pdo->query($query);
    $rows  = $stmt->fetchAll(\PDO::FETCH_ASSOC);
    return array_map(fn($row) => Product::fromArray($row), $rows);
  }

  public function getOptions(): object {
    $warehousesQueryFile = __DIR__ . '/../../sql/selectWarehouses.sql';
    $branchesQueryFile = __DIR__ . '/../../sql/selectBranches.sql';
    $currenciesQueryFile = __DIR__ . '/../../sql/selectCurrencies.sql';
    if (!file_exists($warehousesQueryFile)) {
      throw new RuntimeException("Query file not found: $warehousesQueryFile");
    }
    if (!file_exists($branchesQueryFile)) {
      throw new RuntimeException("Query file not found: $branchesQueryFile");
    }
    if (!file_exists($currenciesQueryFile)) {
      throw new RuntimeException("Query file not found: $currenciesQueryFile");
    }
    $warehousesQuery = file_get_contents($warehousesQueryFile) ?: '';
    $branchesQuery = file_get_contents($branchesQueryFile) ?: '';
    $currenciesQuery = file_get_contents($currenciesQueryFile) ?: '';

    $warehouses = $this->pdo->query($warehousesQuery)->fetchAll(\PDO::FETCH_ASSOC);
    $branches = $this->pdo->query($branchesQuery)->fetchAll(\PDO::FETCH_ASSOC);
    $currencies = $this->pdo->query($currenciesQuery)->fetchAll(\PDO::FETCH_ASSOC);
    return (object) [
      'warehouses' => $warehouses,
      'branches' => $branches,
      'currencies' => $currencies,
    ];
  }

  public function create(array $data): Product {
    $queryFile = __DIR__ . '/../../sql/insertProduct.sql';
    if (!file_exists($queryFile)) {
      throw new RuntimeException("Query file not found: $queryFile");
    }
    $query = file_get_contents($queryFile) ?: '';
    $stmt = $this->pdo->prepare($query);

    $stmt->execute([
      ':code' => $data['code'],
      ':product_name' => $data['product_name'],
      ':warehouse_id' => $data['warehouse_id'],
      ':branch_id' => $data['branch_id'],
      ':currency_id' => $data['currency_id'],
      ':price' => $data['price'],
      ':material_plastic' => !empty($data['material_plastic']) ? 1 : 0,
      ':material_metal' => !empty($data['material_metal']) ? 1 : 0,
      ':material_wood' => !empty($data['material_wood']) ? 1 : 0,
      ':material_glass' => !empty($data['material_glass']) ? 1 : 0,
      ':material_textile' => !empty($data['material_textile']) ? 1 : 0,
      ':product_description' => $data['product_description'] ?? null,
      ':created_at' => date('Y-m-d H:i:s'),
      ]);
      $row = $stmt->fetch(\PDO::FETCH_ASSOC);
      return Product::fromArray($row);
  }
}