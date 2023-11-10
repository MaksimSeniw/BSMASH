/**/
CREATE TABLE customer(
  customer_id INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  username VARCHAR(50),
  password VARCHAR(50),
  funds_avail DECIMAL(3,2),
  items_in_cart INT,
  favorite_type VARCHAR(50),
  cart_id INT FOREIGN KEY
);

CREATE TABLE cart(
  cart_id INT PRIMARY KEY
);

CREATE TABLE cart_line(
  line_id INT PRIMARY KEY,
  cart_id INT FOREIGN KEY,
  item_id INT FOREIGN KEY,
  quantity INT
);

CREATE TABLE order(
  order_id INT PRIMARY KEY,
  order_number INT,
  order_date DATETIME,
  shipping_address VARCHAR(100),
  shipping_city VARCHAR(50),
  shipping_state VARCHAR(50),
  shipping_country VARCHAR(50),
  shipping_zip INT,
  cart_id INT FOREIGN KEY
);

CREATE TABLE order_line(
  line_id INT PRIMARY KEY,
  order_id INT FOREIGN KEY,
  item_id INT FOREIGN KEY,
  quantity INT
);

CREATE TABLE item(
  item_id INT PRIMARY KEY,
  item_name VARCHAR(50),
  item_type VARCHAR(50),
  item_description VARCHAR(100),
  item_price DECIMAL(3,2),
  image FILE
);