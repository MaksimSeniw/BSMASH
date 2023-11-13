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