
CREATE DATABASE Bamazon_db;

USE Bamazon_db;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price DECIMAL(10,2) NOT NULL,
stock_quantity INT,
PRIMARY KEY (item_id)
);
SELECT * FROM products;

INSERT INTO products (product_name,  department_name, price, stock_quantity)
VALUES ("Purina Pro Plan", "Pets", 39.95, 100), ("Ninja Professional Blender", "Appliances", 99.99, 15), ("Death Wish Whole Bean Coffee", "Grocery", 19.99, 20), ("Gnome Solar Garden Light", "Garden", 12.99, 5), ("Swear Word Coloring Book", "Books", 3.95, 80), ("Tide PODS", "Household", 18.99, 150), ("28 oz Shaker Bottle", "Health", 7.10, 49), ("Poo Bags with Dispenser", "Pets", 10.50, 30), ("Penn Extra Duty Tennis Balls, 4-cans", "Sports", 16.35, 50)("Thug Kitchen: The Official Cookbook", "Books", 12.01, 7);