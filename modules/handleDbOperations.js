import 'dotenv/config';
import makeAuthorChecks from './makeAuthorChecks.js';


function writeToDb(json) {
   makeAuthorChecks.checkAuthors(json);
}



export default {
   writeToDb
};