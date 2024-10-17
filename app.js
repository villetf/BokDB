import fs from 'fs';
import talkWithGraph from './modules/talkWithGraph.js';
import handleFile from './modules/handleFile.js';

setInterval(async() => {
   const [token, newRefreshToken] = await talkWithGraph.getToken();
   fs.writeFileSync('./refresh_token', newRefreshToken);
   const itemLink = await talkWithGraph.getLink(token);
   await handleFile.downloadFile(itemLink);
   const csv = handleFile.convertToCSV();
}, 10000);