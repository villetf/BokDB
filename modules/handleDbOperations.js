import 'dotenv/config';
import checkAuthors from './makeAuthorChecks.js';


async function writeToDb(json) {
   checkAuthors(json);
}



export default {
   writeToDb
};