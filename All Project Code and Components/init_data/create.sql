/**/
CREATE TABLE customers(
  customer_id SERIAL PRIMARY KEY,
  first_name VARCHAR(1000),
  last_name VARCHAR(1000),
  username VARCHAR(1000),
  password VARCHAR(1000),
  funds_avail DECIMAL(3,2),
  items_in_cart INT,
  favorite_type VARCHAR(1000),
  cart_id INT
);

CREATE TABLE carts(
  cart_id SERIAL PRIMARY KEY
);

CREATE TABLE cart_lines( 
  line_id SERIAL PRIMARY KEY,
  cart_id INT,
  item_id INT,
  quantity INT
);

CREATE TABLE orders(
  order_id SERIAL PRIMARY KEY,
  order_number INT,
  order_date DATE,
  shipping_address VARCHAR(100),
  shipping_city VARCHAR(50),
  shipping_state VARCHAR(50),
  shipping_country VARCHAR(50),
  shipping_zip INT,
  cart_id INT
);

CREATE TABLE order_lines(
  line_id SERIAL PRIMARY KEY,
  order_id INT,
  item_id INT,
  quantity INT
);

CREATE TABLE items(
  item_id SERIAL PRIMARY KEY,
  item_name VARCHAR(50),
  item_type VARCHAR(50),
  item_description VARCHAR(100),
  item_price DECIMAL(3,2)
);