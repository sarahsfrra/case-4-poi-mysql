CREATE TABLE places(
    id INTEGER AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(150),
    description TEXT,
    lat DOUBLE,
    lng DOUBLE,
    category VARCHAR(150),
    alamat VARCHAR(250),
    rating INTEGER
)