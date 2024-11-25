import fs from 'fs';
import talkWithGraph from './modules/talkWithGraph.js';
import handleFile from './modules/handleFile.js';
import makeAuthorChecks from './makeAuthorChecks.js';

setInterval(async() => {
   const [token, newRefreshToken] = await talkWithGraph.getToken();
   fs.writeFileSync('./refresh_token', newRefreshToken);
   const itemLink = await talkWithGraph.getLink(token);
   await handleFile.downloadFile(itemLink);
   const json = handleFile.convertToJSON();
   const jsonHasChanged = handleFile.checkForChanges(json);
   if (jsonHasChanged) {
      console.log('fil har ändrats');
      makeAuthorChecks.checkAuthors(json);
   } else {
      console.log('fil har inte ändrats');
   }
}, 2000);