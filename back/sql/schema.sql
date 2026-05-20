CREATE TABLE IF NOT EXISTS warehouses (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS branches (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  warehouse_id SERIAL NOT NULL REFERENCES warehouses(id)
);

CREATE TABLE IF NOT EXISTS currencies (
  id SERIAL PRIMARY KEY,
  code VARCHAR(255) NOT NULL UNIQUE,
  label TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  code VARCHAR(255) NOT NULL UNIQUE,
  product_name VARCHAR(255) NOT NULL,
  warehouse_id SERIAL NOT NULL REFERENCES warehouses(id),
  branch_id SERIAL NOT NULL REFERENCES branches(id),
  currency_id SERIAL NOT NULL REFERENCES currencies(id),
  price FLOAT NOT NULL,
  material_plastic BOOLEAN,
  material_metal BOOLEAN, 
  material_wood BOOLEAN,
  material_glass BOOLEAN,
  material_textile BOOLEAN,
  product_description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

