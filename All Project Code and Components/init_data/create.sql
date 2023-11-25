/**/
CREATE TABLE customers(
  customer_id SERIAL PRIMARY KEY,
  first_name VARCHAR(1000),
  last_name VARCHAR(1000),
  username VARCHAR(1000),
  password VARCHAR(1000),
  funds_avail DECIMAL(6,2),
  favorite_type VARCHAR(1000),
  email VARCHAR(1000),
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
  order_total DECIMAL(6,2),
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

-- NEW CHANGES START HERE
CREATE TABLE saved_for_later(
  saved_id SERIAL PRIMARY KEY,
  customer_id INT,
  item_id INT,
  quantity INT
);

ALTER TABLE saved_for_later
ADD CONSTRAINT customer_id FOREIGN KEY (customer_id) REFERENCES customers (customer_id);

ALTER TABLE saved_for_later
ADD CONSTRAINT item_id FOREIGN KEY (item_id) REFERENCES items (item_id);


-- NEW CHANGES END HERE

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
  VALUES (DEFAULT, 'Fedora', 'DRESS', 'A classic fedora hat mlady', 15, 'https://upload.wikimedia.org/wikipedia/commons/9/93/A_fedora_hat%2C_made_by_Borsalino.jpg'),
  (DEFAULT, 'Snapback', 'CASUAL', 'A flatbrim hat fit to you', 20, 'https://m.media-amazon.com/images/I/61It33zI5rL._AC_SX679_.jpg'),
  (DEFAULT, 'Cowboy', 'COSTUME', 'A hat to conquer the wild west', 25, 'https://s7.orientaltrading.com/is/image/OrientalTrading/PDP_VIEWER_IMAGE/adults-brown-cowboy-hat-with-hatband~ur30030bn'),
  (DEFAULT, 'Beret', 'DRESS', 'A french classic, very artistic', 20, 'https://i5.walmartimages.com/seo/TopHeadwear-100-Wool-Beret-Hat-Cap-Black_409d2b32-ed99-4152-a66c-aae12831b1c7_1.f4756059da30205d1012f811409c4eaa.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF'),
  (DEFAULT, 'Sombrero', 'COSTUME', 'A hat for when you are feeling south of the border', 20, 'https://cdn11.bigcommerce.com/s-3stx4pub31/products/6145/images/17495/sombrero-mexicano-con-borlas-adultos-1__53751.1654027564.386.513.jpg?c=2'),
  (DEFAULT, 'Propeller hat', 'COSTUME', 'A hat fit for the first grade', 15, 'https://i.ebayimg.com/images/g/EpsAAOSwmPpg-C1B/s-l1200.webp'),
  (DEFAULT, 'Sports cap', 'COSTUME', 'A cap for sports fans', 18, 'https://fanatics.frgimages.com/denver-broncos/mens-new-era-navy-denver-broncos-the-league-9forty-adjustable-hat_pi2485000_altimages_ff_2485399alt1_full.jpg?_hv=2&w=900'),
  (DEFAULT, 'beanie', 'CASUAL', 'A nice, warm, and comfortable hat', 12, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e86488f5-8d1a-4e0e-b64a-9b6b5b38f134/peak-standard-cuff-futura-beanie-44Jf5h.png'),
  (DEFAULT, 'snow cap', 'CASUAL', 'A warm hat for the winter', 15, 'https://assets.peterglenn.com/jpg/1000x1000/110798_65_HBLU_LG.jpg'),
  (DEFAULT, 'straw hat', 'CASUAL', 'A hat with a wide brim made of straw. Boater and Panama hats fall into this type.', 10, 'https://mobileimages.lowes.com/productimages/49047d7c-2993-4ad9-8def-54364e61b80e/08532487.jpg'),
  (DEFAULT, 'bowler hat', 'DRESS', 'A British hard-felt hat', 20, 'https://i.etsystatic.com/9169083/r/il/4a2b94/4007201880/il_570xN.4007201880_6csd.jpg'),
  (DEFAULT, 'conical hat', 'DRESS', 'An asian conically-shaped hat', 12, 'https://m.media-amazon.com/images/I/71cZ+BVntNL._AC_UY1000_.jpg'),
  (DEFAULT, 'bucket hat', 'DRESS', 'A hat with a downwards brim', 15, 'https://media.revolutionrace.com/api/media/image/beafc5ff-ed37-40e5-b75a-40e867007303'),
  (DEFAULT, 'flat cap', 'CASUAL', 'A British rounded cap, also known as a paddy cap, a bunnet, and a Dai cap', 15, 'https://www.dubarry.com/media/image/e9/c5/e5/987803_1.jpg'),
  (DEFAULT, 'fez', 'CASUAL', 'An exotic flat-topped felt hat with a tassel', 18, 'https://m.media-amazon.com/images/I/71SvhW6HORL.jpg');