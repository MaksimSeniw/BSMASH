/**/
CREATE TABLE customers(
  customer_id SERIAL PRIMARY KEY,
  first_name VARCHAR(1000),
  last_name VARCHAR(1000),
  username VARCHAR(1000),
  password VARCHAR(1000),
  funds_avail DECIMAL(6,2),
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
  order_date VARCHAR(1000),
  shipping_address VARCHAR(1000),
  shipping_city VARCHAR(1000),
  shipping_state VARCHAR(1000),
  shipping_country VARCHAR(1000),
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
  item_name VARCHAR(1000),
  item_type VARCHAR(1000),
  item_description VARCHAR(1000),
  item_price DECIMAL(4,2),
  item_image_link VARCHAR(1000)
);

ALTER TABLE customers
ADD CONSTRAINT cart_id FOREIGN KEY (cart_id) REFERENCES carts (cart_id);

ALTER TABLE cart_lines
ADD CONSTRAINT cart_id FOREIGN KEY (cart_id) REFERENCES carts (cart_id);

ALTER TABLE cart_lines
ADD CONSTRAINT item_id FOREIGN KEY (item_id) REFERENCES items (item_id);

ALTER TABLE orders
ADD CONSTRAINT cart_id FOREIGN KEY (cart_id) REFERENCES carts (cart_id);

ALTER TABLE order_lines
ADD CONSTRAINT order_id FOREIGN KEY (order_id) REFERENCES orders (order_id);

ALTER TABLE order_lines
ADD CONSTRAINT item_id FOREIGN KEY (item_id) REFERENCES items (item_id);

INSERT INTO items (item_id, item_name, item_type, item_description, item_price, item_image_link)
  VALUES (DEFAULT, 'fedora', 'dress', 'A classic fedora hat mlady', 15.00, 'https://upload.wikimedia.org/wikipedia/commons/9/93/A_fedora_hat%2C_made_by_Borsalino.jpg'),
  (DEFAULT, 'snapback', 'casual', 'A flatbrim hat fit to you', 20.00, 'https://m.media-amazon.com/images/I/61It33zI5rL._AC_SX679_.jpg'),
  (DEFAULT, 'cowboy', 'costume', 'A hat to conquer the wild west', 25.00, 'https://s7.orientaltrading.com/is/image/OrientalTrading/PDP_VIEWER_IMAGE/adults-brown-cowboy-hat-with-hatband~ur30030bn'),
  (DEFAULT, 'beret', 'dress', 'A french classic, very artistic', 20.00, 'https://i5.walmartimages.com/seo/TopHeadwear-100-Wool-Beret-Hat-Cap-Black_409d2b32-ed99-4152-a66c-aae12831b1c7_1.f4756059da30205d1012f811409c4eaa.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF'),
  (DEFAULT, 'sombrero', 'costume', 'A hat for when you are feeling south of the border', 20.00, 'https://cdn11.bigcommerce.com/s-3stx4pub31/products/6145/images/17495/sombrero-mexicano-con-borlas-adultos-1__53751.1654027564.386.513.jpg?c=2'),
  (DEFAULT, 'propeller hat', 'costume', 'A hat fit for the first grade', 15.00, 'https://i.ebayimg.com/images/g/EpsAAOSwmPpg-C1B/s-l1200.webp');

