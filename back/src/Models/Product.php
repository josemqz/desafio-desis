<?php

namespace App\Models;

class Product {
  public function __construct(
    public readonly string $code,
    public readonly string $product_name,
    public readonly int $warehouse_id,
    public readonly int $branch_id,
    public readonly int $currency_id,
    public readonly float $price,
    public readonly bool $material_plastic,
    public readonly bool $material_metal,
    public readonly bool $material_wood,
    public readonly bool $material_glass,
    public readonly bool $material_textile,
    public readonly string $product_description,
    public readonly \DateTimeImmutable $created_at
  ) {}

   public static function fromArray(array $row): self {
        return new self(
            code: $row['code'],
            product_name: $row['product_name'],
            warehouse_id: $row['warehouse_id'],
            branch_id: $row['branch_id'],
            currency_id: $row['currency_id'],
            price: (float) $row['price'],
            material_plastic: (bool) $row['material_plastic'],
            material_metal: (bool) $row['material_metal'],
            material_wood: (bool) $row['material_wood'],
            material_glass: (bool) $row['material_glass'],
            material_textile: (bool) $row['material_textile'],
            product_description: $row['product_description'],
            created_at: new \DateTimeImmutable($row['created_at'])
        );
    }
}
