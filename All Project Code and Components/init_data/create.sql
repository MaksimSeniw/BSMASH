/*creating customers table with important personal info, their available funds, 
and a foreign key to their cart*/
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

/*creating the carts table*/
CREATE TABLE carts(
  cart_id SERIAL PRIMARY KEY
);

/*creating the cart lines table that links carts to items and their quantity*/
CREATE TABLE cart_lines( 
  line_id SERIAL PRIMARY KEY,
  cart_id INT,
  item_id INT,
  quantity INT
);

/*creating the orders table that holds shipping info, the amount the order cost (to be deducted) 
and the cart that the order was created from*/
CREATE TABLE orders(
  order_id SERIAL PRIMARY KEY,
  order_date VARCHAR(1000),
  shipping_address VARCHAR(1000),
  shipping_city VARCHAR(1000),
  shipping_zip INT,
  shipping_state VARCHAR(1000),
  shipping_country VARCHAR(1000),
  order_total DECIMAL(6,2),
  cart_id INT
);

/*creating the order lines table that links the order to the items in the order*/
CREATE TABLE order_lines(
  line_id SERIAL PRIMARY KEY,
  order_id INT,
  item_id INT,
  quantity INT
);

/*creating the items table that stores important info about the hats on the site*/
CREATE TABLE items(
  item_id SERIAL PRIMARY KEY,
  item_name VARCHAR(1000),
  item_type VARCHAR(1000),
  item_description VARCHAR(1000),
  item_price DECIMAL(4,2),
  item_image_link VARCHAR(1000)
);

/*creating the saved for later table that links customers to their saved items*/
CREATE TABLE saved_for_later(
  saved_id SERIAL PRIMARY KEY,
  customer_id INT,
  item_id INT,
  quantity INT
);

/*adding foreign key restraints to all the tables that require it*/
ALTER TABLE saved_for_later
ADD CONSTRAINT customer_id FOREIGN KEY (customer_id) REFERENCES customers (customer_id);

ALTER TABLE saved_for_later
ADD CONSTRAINT item_id FOREIGN KEY (item_id) REFERENCES items (item_id);


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

/*Inserting all the hats our website will sell into the items table*/
INSERT INTO items (item_id, item_name, item_type, item_description, item_price, item_image_link)
  VALUES (DEFAULT, 'Fedora', 'Dress', 'A classic fedora hat mlady', 15.00, 'https://upload.wikimedia.org/wikipedia/commons/9/93/A_fedora_hat%2C_made_by_Borsalino.jpg'),
  (DEFAULT, 'Snapback', 'Casual', 'A flatbrim hat fit to you', 20.00, 'https://m.media-amazon.com/images/I/61It33zI5rL._AC_SX679_.jpg'),
  (DEFAULT, 'Cowboy', 'Costume', 'A hat to conquer the wild west', 25.00, 'https://s7.orientaltrading.com/is/image/OrientalTrading/PDP_VIEWER_IMAGE/adults-brown-cowboy-hat-with-hatband~ur30030bn'),
  (DEFAULT, 'Beret', 'Dress', 'A french classic, very artistic', 20.00, 'https://i5.walmartimages.com/seo/TopHeadwear-100-Wool-Beret-Hat-Cap-Black_409d2b32-ed99-4152-a66c-aae12831b1c7_1.f4756059da30205d1012f811409c4eaa.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF'),
  (DEFAULT, 'Sombrero', 'Costume', 'A hat for when you are feeling south of the border', 20.00, 'https://cdn11.bigcommerce.com/s-3stx4pub31/products/6145/images/17495/sombrero-mexicano-con-borlas-adultos-1__53751.1654027564.386.513.jpg?c=2'),
  (DEFAULT, 'Propeller hat', 'Costume', 'A hat fit for the first grade', 15.00, 'https://i.ebayimg.com/images/g/EpsAAOSwmPpg-C1B/s-l1200.webp'),
  (DEFAULT, 'Sports Cap', 'Casual', 'A hat to wear to the ballpark', 10.00, 'https://fanatics.frgimages.com/denver-broncos/mens-new-era-navy-denver-broncos-the-league-9forty-adjustable-hat_pi2485000_altimages_ff_2485399alt1_full.jpg?_hv=2&w=900'),
  (DEFAULT, 'Beanie', 'Casual', 'A hat for a cold winter day', 15.00, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e86488f5-8d1a-4e0e-b64a-9b6b5b38f134/peak-standard-cuff-futura-beanie-44Jf5h.png'),
  (DEFAULT, 'Snow Cap', 'Casual', 'A beanie with a little extra poof', 20.00, 'https://assets.peterglenn.com/jpg/1000x1000/110798_65_HBLU_LG.jpg'),
  (DEFAULT, 'Fez', 'Costume', 'A classic fez hat', 20.00, 'https://upload.wikimedia.org/wikipedia/commons/9/90/Fez.jpg'),
  (DEFAULT, 'Santa Hat', 'Costume', 'The iconic red hat we all know', 15.00, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Santa_hat.svg/615px-Santa_hat.svg.png'),
  (DEFAULT, 'Bowler', 'Dress', 'A hat fit for Charlie Chaplin', 20.00, 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Bowler_hat%2C_Vienna%2C_mid-20th_century.jpg'),
  (DEFAULT, 'Pith Helmet','Costume', 'A hat for jungle explorers', 25.00, 'https://m.media-amazon.com/images/I/610EgBH2w2L._AC_UY1000_.jpg'),
  (DEFAULT, 'Coonskin Hat', 'Costume', 'A hat for mountain men', 20.00, 'https://www.heritagecostumes.com/images/products/6520.jpg'),
  (DEFAULT, 'Top Hat', 'Dress', 'A hat fit for Abraham Lincoln', 25.00, 'https://m.media-amazon.com/images/I/31At6NZK-8L._AC_.jpg'),
  (DEFAULT, 'Chefs Hat', 'Costume', 'Order up!', 15.00, 'https://m.media-amazon.com/images/I/512wWLhYo7L.jpg'),
  (DEFAULT, 'Ushanka', 'Costume', 'A hat to survive a Russian Winter', 20.00, 'https://i.etsystatic.com/9014938/r/il/485e06/572427725/il_fullxfull.572427725_4p67.jpg'),
  (DEFAULT, 'Straw Hat', 'casual', 'A hat with a wide brim made of straw. Boater and Panama hats fall into this type.', 10.00, 'https://mobileimages.lowes.com/productimages/49047d7c-2993-4ad9-8def-54364e61b80e/08532487.jpg'),
  (DEFAULT, 'Conical Hat', 'dress', 'An asian conically-shaped hat', 12.00, 'https://m.media-amazon.com/images/I/71cZ+BVntNL._AC_UY1000_.jpg'),
  (DEFAULT, 'Bucket Hat', 'dress', 'A hat with a downwards brim', 15.00, 'https://media.revolutionrace.com/api/media/image/beafc5ff-ed37-40e5-b75a-40e867007303'),
  (DEFAULT, 'Fire Fighter Hat', 'Costume', 'A hat for your next heat check', 10.000, 'https://cdn.media.amplience.net/i/partycity/911186?$large$&fmt=auto&qlt=default'),
  (DEFAULT, 'Flat cap', 'Casual', 'A British rounded cap, also known as a paddy cap, a bunnet, and a Dai cap', 15.00, 'https://www.dubarry.com/media/image/e9/c5/e5/987803_1.jpg'),
  (DEFAULT,'Clown Hat', 'Costume', 'A colorful and funny hat for entertainers', 18.00, 'https://media.istockphoto.com/id/494238567/photo/jester-hat-isolated-on-white.jpg?s=1024x1024&w=is&k=20&c=jUbOphIk8PKwJHqg2JcpC5OaNSIBYsnCibTllRvoaO0='),
  (DEFAULT, 'Sombrero Vueltiao', 'Costume', 'A traditional Colombian hat with a unique woven pattern', 30.00, 'https://m.media-amazon.com/images/I/81g85G0GVBL._AC_SX679_.jpg');

