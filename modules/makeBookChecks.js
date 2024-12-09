import { getConnection } from './getDbConnection.js';
import helpers from './helpers.js';



async function checkBooks(json) {
   const connection = await getConnection();
   const dbBooks = await connection.query('SELECT title, year_written, language_id, original_language_id, genre_id, format FROM books;');

   // checkAddedBooks(json, dbBooks);
   // checkDeletedBooks(json, dbBooks);
   // checkChangedBooks(json, dbBooks);
}

async function checkAddedBooks(json, dbBooks) {
   const addedBooks = helpers.checkOccurenceInList(dbBooks, json, 'title', 'Titel');
   addedBooks.forEach(book => {
      addNewBook(book);
   });
}

async function checkDeletedBooks(json, dbBooks) {
   const deletedBooks = helpers.checkOccurenceInList(json, dbBooks, 'Titel', 'title');
   deletedBooks.forEach(book => {
      deleteBook(book);
   });
}

async function checkChangedBooks(json, dbBooks) {
   
}

async function addNewBook(book) {
   console.log('bok att lägga till', book);
}

async function deleteBook(book) {
   
}

export default {
   checkBooks
};