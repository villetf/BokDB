import axios from 'axios';
import xlsx from 'xlsx';
import fs from 'fs';

async function downloadFile(itemLink) {
   const response = await axios.get(itemLink, {
      responseType: 'arraybuffer'
   });
   fs.writeFileSync('/tmp/books.xlsx', response.data);
}

function convertToJSON() {
   const workbook = xlsx.readFile('/tmp/books.xlsx');
   const sheetName = workbook.SheetNames[0];
   const worksheet = workbook.Sheets[sheetName];
   const jsonData = xlsx.utils.sheet_to_json(worksheet);
   return jsonData;
}

function checkForChanges(json) {
   if (!fs.existsSync('/tmp/oldFile.json')) {
      fs.writeFileSync('/tmp/oldFile.json', '');

   }
   const oldJson = fs.readFileSync('/tmp/oldFile.json', 'utf8');
   if (oldJson == JSON.stringify(json)) {
      return false;
   }
   fs.writeFileSync('/tmp/oldFile.json', JSON.stringify(json));
   return true;
}

export default {
   downloadFile,
   convertToJSON,
   checkForChanges
};