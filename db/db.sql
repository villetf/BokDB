CREATE TABLE
   genres (
      id INT PRIMARY KEY AUTO_INCREMENT,
      genre VARCHAR(255)
   );

CREATE TABLE
   languages (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL
   );

CREATE TABLE
   countries (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL
   );

CREATE TABLE
   books (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      year_written INT CHECK (
         year_written >= -1000
         AND year_written <= 2100
      ),
      language_id INT,
      original_language_id INT,
      genre_id INT,
      format ENUM ('Inbunden', 'Pocket', 'Häftad'),
      FOREIGN KEY (language_id) REFERENCES languages (id) ON DELETE SET NULL,
      FOREIGN KEY (original_language_id) REFERENCES languages (id) ON DELETE SET NULL,
      FOREIGN KEY (genre_id) REFERENCES genres (id) ON DELETE SET NULL
   );

CREATE TABLE
   authors (
      id INT PRIMARY KEY AUTO_INCREMENT,
      first_name VARCHAR(255),
      last_name VARCHAR(255),
      gender ENUM ('Man', 'Kvinna', 'Annat'),
      birth_year INT CHECK (
         birth_year >= -1000
         AND birth_year <= 2100
      ),
      country_id INT,
      FOREIGN KEY (country_id) REFERENCES countries (id) ON DELETE SET NULL
   );

CREATE TABLE
   book_authors (
      book_id INT,
      author_id INT,
      PRIMARY KEY (book_id, author_id),
      FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE,
      FOREIGN KEY (author_id) REFERENCES authors (id) ON DELETE CASCADE
   );


CREATE INDEX idx_title ON books (title);

CREATE INDEX idx_last_name ON authors (last_name);

CREATE INDEX idx_language_id ON books (language_id);

CREATE INDEX idx_original_language_id ON books (original_language_id);

CREATE INDEX idx_genre_id ON books (genre_id);

CREATE INDEX idx_book_id ON book_authors (book_id);

CREATE INDEX idx_author_id ON book_authors (author_id);