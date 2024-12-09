import fs from 'fs';

function getIndividualAuthors(json) {
   const completeList = [];
   json.forEach(book => {
      if (!book.Författare) {
         return;
      }
      const allAuthors = book.Författare.split(' & ');
      allAuthors.forEach(author => {
         author = author.trim();
         const authorInfo = {
            fullName: author,
            gender: book.Författarkön,
            birthYear: book.Födelseår,
            country: book.Land
         };
         if (authorInfo.gender == 'Par') {
            authorInfo.gender = null;
         }
         const nameList = [];
         completeList.forEach(name => {
            nameList.push(name.fullName);
         });
         if (!nameList.includes(author)) {
            completeList.push(authorInfo);
         }
      });
   });
   return completeList;
}

function getFirstName(fullName) {
   return fullName.replace(/.*, /, '');
}

function getLastName(fullName) {
   return fullName.replace(/,.*/, '');
}

async function getCountryId(country, connection) {
   const idData = await connection.query(`SELECT id FROM countries WHERE name = '${country}'`);
   if (idData[0][0]) {
      return idData[0][0].id;
   }

   return null;
}

function logError(error, errortype) {
   const date = new Date().toLocaleString();
   const errorString = `${date}\n${errortype} uppstod:\n${error.stack || error.message}\n\n`;
   fs.appendFileSync('./errors.log', errorString);
};

// listToLookIn är den lista som ska kollas, thingsToLookFor[secondProperty] är den förekomsten man ska leta efter
function checkOccurenceInList(listToLookIn, thingsToLookFor, firstProperty, secondProperty) {

   const returnList = [];
   const isolatedListLookIn = [];
   listToLookIn.forEach(thing => {
      isolatedListLookIn.push(thing[firstProperty]);
   });

   thingsToLookFor.forEach(thing => {
      let correctThing;
      if (!secondProperty) {
         correctThing = thing;
      } else {
         correctThing = thing[secondProperty];
      }
      if (!isolatedListLookIn.includes(correctThing)) {
         returnList.push(thing);
      }
   });
   return returnList;
}

export default {
   getIndividualAuthors,
   getFirstName,
   getLastName,
   getCountryId,
   logError,
   checkOccurenceInList
};


