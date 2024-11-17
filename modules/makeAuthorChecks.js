import getDbConnection from './getDbConnection.js';
import { getFirstName, getIndividualAuthors, getLastName } from './helpers.js';



async function checkAuthors(json) {
   const connection = await getDbConnection.getConnection();
   const authors = await connection.query('SELECT first_name, last_name FROM authors;');
   // Listan över alla författare som finns i databasen stoppas i dbAuthorsList
   const dbAuthorsList = [];
   authors[0].forEach(author => {
      if (author.last_name == null) {
         dbAuthorsList.push(author.first_name);
      } else {
         dbAuthorsList.push(author.last_name + ', ' + author.first_name);
      }
   });
   const excelAuthors = getIndividualAuthors(json);

   checkNewAuthors(dbAuthorsList, excelAuthors, connection);
   checkDeletedAuthors(dbAuthorsList, excelAuthors, connection);
}

// Kollar om det finns några författare i excelarket som inte finns i databasen
async function checkNewAuthors(dbAuthorsList, excelAuthors, connection) {
   excelAuthors.forEach(async author => {
      if (!dbAuthorsList.includes(author.fullName)) {
         dbAuthorsList.push(author.fullName);
         await writeNewAuthor(author, connection);
      }
   });
}

// Kollar om det finnas några författare i databasen som inte finns i excelarket
function checkDeletedAuthors(dbAuthorsList, excelAuthors, connection) {
   const excelAuthorsNames = [];
   excelAuthors.forEach(author => {
      excelAuthorsNames.push(author.fullName);
   });
   dbAuthorsList.forEach(author => {
      if (!excelAuthorsNames.includes(author)) {
         console.log('nu har det ändrats');
         console.log(author);
         const firstName = getFirstName(author);
         const lastName = getLastName(author);
         connection.query(`DELETE FROM authors WHERE first_name = '${firstName}' AND last_name = '${lastName}';`);
      }
   });
}

// Lägger till ny författare i databasen
async function writeNewAuthor(author, connection) {
   const firstName = getFirstName(author.fullName);
   let lastName = getLastName(author.fullName);
   let gender = author.Författarkön ?? null;
   const birth_year = author.Födelseår ?? null;

   if (gender === 'Par') {
      gender = null;
   }

   if (!author.fullName.match(',')) {
      lastName = null;
   }

   let countryId = null;
   if (author.Land) {
      const idData = await connection.query(`SELECT id FROM countries WHERE name = '${author.Land}'`);
      countryId = idData[0][0].id;
   }

   const sql = 'INSERT INTO authors (first_name, last_name, gender, birth_year, country_id) VALUES (?,?,?,?,?)';
   await connection.execute(sql, [firstName, lastName, gender, birth_year, countryId]);
}

function editAuthor(author, currentBook, connection) {

}



export default {
   checkAuthors
};