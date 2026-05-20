INSERT INTO warehouses (label) VALUES ('Bodega 56');
INSERT INTO warehouses (label) VALUES ('Bodega 677');

INSERT INTO branches (label, warehouse_id) VALUES ('Sucursal 12', 1);
INSERT INTO branches (label, warehouse_id) VALUES ('Sucursal 23', 1);
INSERT INTO branches (label, warehouse_id) VALUES ('Sucursal 77', 2);

INSERT INTO currencies (code, label) VALUES ('CLP', 'Peso Chileno');
INSERT INTO currencies (code, label) VALUES ('USD', 'Dolar Estadounidense');