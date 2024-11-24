import getDbConnection from './getDbConnection.js';
import helpers from './helpers.js';


// Kollar genom olika funktioner ifall någon författare har ändrats
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
   const excelAuthors = helpers.getIndividualAuthors(json);

   checkNewAuthors(dbAuthorsList, excelAuthors, connection);
   checkDeletedAuthors(dbAuthorsList, excelAuthors, connection);
   editAuthor(dbAuthorsList, excelAuthors, connection);
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
         const firstName = helpers.getFirstName(author);
         const lastName = helpers.getLastName(author);
         connection.query(`DELETE FROM authors WHERE first_name = '${firstName}' AND last_name = '${lastName}';`);
      }
   });
}

// Lägger till ny författare i databasen
async function writeNewAuthor(author, connection) {
   const firstName = helpers.getFirstName(author.fullName);
   let lastName = helpers.getLastName(author.fullName);
   const gender = author.Författarkön ?? null;
   const birth_year = author.Födelseår ?? null;

   if (!author.fullName.match(',')) {
      lastName = null;
   }

   let countryId = null;
   if (author.Land) {
      const idData = await helpers.getCountryId(author.Land, connection);
      countryId = idData[0][0].id;
   }

   const sql = 'INSERT INTO authors (first_name, last_name, gender, birth_year, country_id) VALUES (?,?,?,?,?)';
   try {
      await connection.execute(sql, [firstName, lastName, gender, birth_year, countryId]);
   } catch (error) {
      helpers.logError(error, 'Fel vid databasskrivning av ny författare');
   }
}

// Kör en update-query mot alla existerande författare för att synka gjorda ändringar
function editAuthor(dbAuthorsList, excelAuthors, connection) {
   console.log('inne i edit');
   excelAuthors.forEach(async author => {
      const sql = 'UPDATE authors SET gender = ?, birth_year = ?, country_id = ? WHERE first_name = ? AND last_name = ?';
      const countryId = await helpers.getCountryId(author.country, connection);
      const firstName = helpers.getFirstName(author.fullName);
      const lastName = helpers.getLastName(author.fullName);
      try {
         await connection.execute(sql, [author.gender ?? null, author.birthYear ?? null, countryId, firstName, lastName]);
      } catch (error) {
         helpers.logError(error, 'Fel vid databasskrivning vid ändring av författare');
      }
   });
}



export default {
   checkAuthors
};