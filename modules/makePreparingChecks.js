import { getConnection } from './getDbConnection.js';
import helpers from './helpers.js';

function checkLanguages(json) {
   checkLanguagesOrGenres(json, 'languages');
}

function checkGenres(json) {
   checkLanguagesOrGenres(json, 'genres');
}

async function checkLanguagesOrGenres(json, type) {
   let table;
   let errorType;
   let column;
   if (type == 'languages') {
      table = 'languages';
      errorType = 'språk';
      column = 'Språk';
   } else {
      table = 'genres';
      errorType = 'genre';
      column = 'Genre';
   }

   const connection = await getConnection();
   let dbDataRaw;
   try {
      dbDataRaw = await connection.query(`SELECT id, name FROM ${table};`);
   } catch (error) {
      helpers.logError(error, `Fel vid hämtning av ${errorType} från databas`);
      throw error;
   }
   const dbList = [];
   dbDataRaw[0].forEach(post => {
      dbList.push(post.name);
   });

   const excelList = [];
   json.forEach(row => {
      if (row[column] && !excelList.includes(row[column])) {
         excelList.push(row[column]);
      }

      if (type == 'language' && row.Originalspråk && !excelList.includes(row.Originalspråk)) {
         excelList.push(row.Originalspråk);
      }
   });

   excelList.forEach(async row => {
      if (!dbList.includes(row)) {
         try {
            await connection.execute(`INSERT INTO ${table} (name) VALUES (?)`, [row]);
         } catch (error) {
            helpers.logError(error, `Fel vid databasskrivning av ny ${errorType}`);
         }
      }
   });
}



export default {
   checkLanguages,
   checkGenres
};