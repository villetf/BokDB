export function getIndividualAuthors(json) {
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
         if (!completeList.includes(author)) {
            completeList.push(authorInfo);
         }
      });
   });
   return completeList;
}

export function getFirstName(fullName) {
   return fullName.replace(/.*, /, '');
}

export function getLastName(fullName) {
   return fullName.replace(/,.*/, '');
}

