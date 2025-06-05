-- User table
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    is_admin BOOLEAN NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert single admin account (password should be hashed in production)
INSERT INTO user (username, email, password, is_admin) VALUES ('admin', 'admin@example.com', 'admin123', 1);

-- Category table (fixed categories)
CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- Product table
CREATE TABLE product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    price DECIMAL(10,2) NOT NULL,
    image_path VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES category(id)
);

-- Wishlist table
CREATE TABLE wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Cart table
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Cart item table
CREATE TABLE cart_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES cart(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Voucher table 
CREATE TABLE voucher (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_percent DECIMAL(4,2) NOT NULL,
    min_purchase DECIMAL(10,2) NOT NULL,
    description VARCHAR(255),
    image_path VARCHAR(255)
);

-- User voucher table
CREATE TABLE user_voucher (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    voucher_id INT NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT 0,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (voucher_id) REFERENCES voucher(id)
);

-- Order table
CREATE TABLE `order` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    status ENUM('pending', 'confirmed') NOT NULL DEFAULT 'pending',
    total_price DECIMAL(10,2) NOT NULL,
    voucher_id INT,
    delivery_fee DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (voucher_id) REFERENCES voucher(id)
);

-- Order item table
CREATE TABLE order_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES `order`(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Fixed categories (example, update as needed)
INSERT INTO category (name, description) VALUES
('Sos', 'Pelbagai jenis sos'),
('Rempah', 'Rempah dan perencah'),
('Minuman', 'Minuman kesihatan dan kopi/teh'),
('Mee', 'Produk mee segera'),
('Madu', 'Produk madu'),
('Lain-lain', 'Produk lain-lain');

-- Products (updated with provided names, descriptions, prices, and image paths)
INSERT INTO product (name, description, category_id, quantity, price, image_path) VALUES
('Saffron ZAFA''RAN', 'Premium saffron threads', 6, 20, 27.00, 'QurbaProductPhoto/Lain-lain/Saffron ZAFA''RAN.png'),
('Minyak Bidara - 120ML', 'Pure bidara oil, 120ml', 6, 20, 55.00, 'QurbaProductPhoto/Lain-lain/Minyak Bidara - 120ML.png'),
('Minyak Bidara - 45ML', 'Pure bidara oil, 45ml', 6, 20, 35.00, 'QurbaProductPhoto/Lain-lain/Minyak Bidara - 45ML.png'),
('MADU MINDA', 'Natural honey for brain health', 5, 20, 45.00, 'QurbaProductPhoto/Madu/MADU MINDA.png'),
('LI KHAMSATUN', 'Premium blended honey', 5, 20, 58.00, 'QurbaProductPhoto/Madu/LI KHAMSATUN.png'),
('Perisa Sup', 'Saffron-infused soup noodles', 4, 20, 14.00, 'QurbaProductPhoto/Mee/Perisa Sup.png'),
('Perisa Tomyam ODEEN', 'Spicy tomyam saffron noodles', 4, 20, 14.00, 'QurbaProductPhoto/Mee/Perisa Tomyam ODEEN.png'),
('Perisa Kari', 'Rich curry saffron noodles', 4, 20, 14.00, 'QurbaProductPhoto/Mee/Perisa Kari.png'),
('KOPI IBNU SINA', 'Traditional Arabic coffee blend', 3, 20, 23.00, 'QurbaProductPhoto/Minuman/Kopi Ibnu Sina.png'),
('TEH IBNU SINA', 'Herbal tea with saffron', 3, 20, 24.00, 'QurbaProductPhoto/Minuman/Teh Ibnu Sina.png'),
('Khal Tanpa Herba - 500 ML', 'Pure vinegar, 500ml', 2, 20, 40.00, 'QurbaProductPhoto/Rempah/Khal Tanpa Herba - 500 ML.png'),
('Khal Dengan Herba - 500 ML', 'Herbal vinegar, 500ml', 2, 20, 60.00, 'QurbaProductPhoto/Rempah/Khal Dengan Herba - 500 ML.png'),
('Khal Dengan Herba - 1LITER', 'Herbal vinegar, 1 liter', 2, 20, 95.00, 'QurbaProductPhoto/Rempah/Khal Dengan Herba - 1LITER.png'),
('Serbuk Perencah Penyedap Burger', 'Burger seasoning powder', 2, 20, 5.00, 'QurbaProductPhoto/Rempah/Serbuk Perencah Penyedap Burger.png'),
('Chili Giling', 'Ground chili paste', 1, 20, 3.00, 'QurbaProductPhoto/Sos/Chili Giling.png'),
('Asam Jawa Plus', 'Tamarind sauce with spices', 1, 20, 4.30, 'QurbaProductPhoto/Sos/Asam Jawa Plus.png'),
('Sos Lada Hitam - 1KG', 'Black pepper sauce, 1kg', 1, 20, 5.50, 'QurbaProductPhoto/Sos/Sos Lada Hitam - 1KG.png'),
('Sos Lada Hitem - 340g', 'Black pepper sauce, 340g', 1, 20, 3.80, 'QurbaProductPhoto/Sos/Sos Lada Hitem - 340g.png'),
('Sos Tiram - 340g', 'Oyster sauce, 340g', 1, 20, 3.80, 'QurbaProductPhoto/Sos/Sos Tiram - 340g.png'),
('Sos Cili Burger - 340g', 'Chili sauce for burgers, 340g', 1, 20, 3.00, 'QurbaProductPhoto/Sos/Sos Cili Burger - 340g.png'),
('Kuah Rojak Madu - 400g', 'Honey rojak sauce, 400g', 1, 20, 5.50, 'QurbaProductPhoto/Sos/Kuah Rojak Madu - 400g.png');

-- Insert voucher types
INSERT INTO voucher (code, discount_percent, min_purchase, description, image_path) VALUES
('VOUCHER3', 3.00, 50.00, '3% discount on purchases of 50.00 or more', 'QurbaProductPhoto/voucher/3%.png'),
('VOUCHER5', 5.00, 100.00, '5% discount on purchases of 100.00 or more', 'QurbaProductPhoto/voucher/5%.png'),
('VOUCHER8', 8.00, 200.00, '8% discount on purchases of 200.00 or more', 'QurbaProductPhoto/voucher/8%.png'); 