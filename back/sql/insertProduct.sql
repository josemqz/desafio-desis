INSERT INTO products (
  code, product_name, warehouse_id, branch_id, currency_id, price,
  material_plastic, material_metal, material_wood, material_glass, material_textile,
  product_description, created_at
) VALUES (
  :code, :product_name, :warehouse_id, :branch_id, :currency_id, :price,
  :material_plastic, :material_metal, :material_wood, :material_glass, :material_textile,
  :product_description, :created_at
) RETURNING *;