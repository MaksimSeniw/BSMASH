DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
  username VARCHAR(50) PRIMARY KEY,
  password CHAR(60) NOT NULL
);

DROP TABLE IF EXISTS hats CASCADE;
CREATE TABLE hats(
  hat_type VARCHAR(50) PRIMARY KEY,
  product_name VARCHAR(60) NOT NULL,
  order_id INT,
  price DECIMAL(3,2),
  quantity INT
);

DROP TABLE IF EXISTS customers CASCADE;
CREATE TABLE customers(
  customer_id INT PRIMARY KEY,
  username CHAR(60) NOT NULL,
  order_id INT,
  address VARCHAR(50),
  city VARCHAR(15)  NULL,
  region VARCHAR(15)  NULL
);

DROP TABLE IF EXISTS shipping_info CASCADE;
CREATE TABLE shipping_info(
  shipping_id INT PRIMARY KEY,
  customer_id INT FOREIGN KEY,
  location VARCHAR(50) NOT NULL,
  city VARCHAR(15)  NULL,
  region VARCHAR(15)  NULL,
  order_id INT,
  order_date datetime,
  ship_date datetime
);