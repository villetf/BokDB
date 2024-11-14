import getConnection from './getDbConnection.js';

async function checkAuthors(json) {
   const connection = await getConnection();
   const authors = await connection.query('SELECT first_name, last_name FROM authors;');
   // connection.release();
   // Listan över alla författare som finns i databasen stoppas i dbAuthorsList
   const dbAuthorsList = [];
   authors[0].forEach(author => {
      if (author.last_name == null) {
         dbAuthorsList.push(author.first_name);
      } else {
         dbAuthorsList.push(author.last_name + ', ' + author.first_name);
      }
   });

   checkDeletedAuthors(dbAuthorsList, json, connection);

   for (const book in json) {
      const currentBook = json[book];
      if (!currentBook.Författare) {
         return;
      }
      const allAuthors = currentBook.Författare.split('&');
      allAuthors.forEach(async author => {
         author = author.trim();
         if (!dbAuthorsList.includes(author)) {
            dbAuthorsList.push(author);
            await writeNewAuthor(author, currentBook, connection);
         } else {
            // await editAuthor(author, currentBook, connection);
         }
      });
   }


}

function checkDeletedAuthors(dbAuthorsList, json, connection) {
   const excelAuthors = [];
   json.forEach(book => {
      if (!book.Författare) {
         return;
      }
      const allAuthors = book.Författare.split(' & ');
      allAuthors.forEach(author => {
         author = author.trim();
         if (!excelAuthors.includes(author)) {
            console.log(author);
            excelAuthors.push(author);
         }
      });
   });

   dbAuthorsList.forEach(author => {
      if (!excelAuthors.includes(author)) {
         connection.query('');
      }
   });
}

async function writeNewAuthor(author, currentBook, connection) {
   const firstName = author.replace(/.*, /, '');
   let lastName = author.replace(/,.*/, '');
   let gender = currentBook.Författarkön ?? null;
   const birth_year = currentBook.Födelseår ?? null;

   if (gender === 'Par') {
      gender = null;
   }

   if (!author.match(',')) {
      lastName = null;
   }

   let countryId = null;
   if (currentBook.Land) {
      const idData = await connection.query(`SELECT id FROM countries WHERE name = '${currentBook.Land}'`);
      countryId = idData[0][0].id;
   }

   const sql = 'INSERT INTO authors (first_name, last_name, gender, birth_year, country_id) VALUES (?,?,?,?,?)';
   await connection.execute(sql, [firstName, lastName, gender, birth_year, countryId]);
}

function editAuthor(author, currentBook, connection) {
   console.log('finns redan');
   console.log(author);
   console.log(currentBook);
   console.log('');
}

export default {
   checkAuthors
};