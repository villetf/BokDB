import { getConnection } from './getDbConnection.js';
import helpers from './helpers.js';

async function checkLanguages(json) {
   const connection = await getConnection();
   let dbLanguages;
   try {
      dbLanguages = await connection.query('SELECT id, name FROM languages;');
   } catch (error) {
      helpers.logError(error, 'Fel vid hämtning av språk från databas');
      throw error;
   }
   const excelLanguages = [];
   json.forEach(book => {
      if (book.Språk && !excelLanguages.includes(book.Språk)) {
         excelLanguages.push(book.Språk);
      }

      if (book.Originalspråk && !excelLanguages.includes(book.Originalspråk)) {
         excelLanguages.push(book.Originalspråk);
      }
   });
   console.log(dbLanguages[0][0]);
   console.log(excelLanguages);
}

function checkGenres(json) {

}

export default {
   checkLanguages,
   checkGenres
};