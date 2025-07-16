CREATE DATABASE IF NOT EXISTS sales_warehouse;
USE sales_warehouse;

CREATE TABLE IF NOT EXISTS product_sales_summary (
    product_id INT PRIMARY KEY,
    total_quantity INT,
    total_sale_amount DECIMAL(10, 2),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Pre-populate with some initial aggregated data
INSERT INTO product_sales_summary (product_id, total_quantity, total_sale_amount)
VALUES
    (101, 6, 120.00),
    (102, 3, 60.00),
    (103, 4, 80.00),
    (104, 2, 50.00),
    (105, 1, 25.00)
ON DUPLICATE KEY UPDATE
    total_quantity = VALUES(total_quantity),
    total_sale_amount = VALUES(total_sale_amount); 