DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user'
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    total NUMERIC(10,2) NOT NULL
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL
);

INSERT INTO users (email, password, role) VALUES
('admin@test.com', '12345', 'admin'),
('user1@test.com', '12345', 'user'),
('user2@test.com', '12345', 'user');

INSERT INTO products (name, description, price) VALUES
('Laptop', 'Good laptop for developers', 1200.00),
('Mouse', 'Wireless mouse', 25.00),
('Keyboard', 'Mechanical keyboard', 80.00),
('Monitor', '27 inch monitor', 300.00);

INSERT INTO orders (user_id, product_id, quantity, total) VALUES
(2, 1, 1, 1200.00),
(2, 2, 2, 50.00),
(3, 3, 1, 80.00);

INSERT INTO reviews (product_id, user_id, content) VALUES
(1, 2, 'Very good laptop'),
(2, 3, 'Nice mouse');