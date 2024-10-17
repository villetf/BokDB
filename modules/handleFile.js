import axios from 'axios';
import xlsx from 'xlsx';
import fs from 'fs';

async function downloadFile(itemLink) {
   const response = await axios.get(itemLink, {
      responseType: 'arraybuffer'
   });
   fs.writeFileSync('/tmp/books.xlsx', response.data);
}

function convertToCSV() {
   const workbook = xlsx.readFile('/tmp/books.xlsx');
   const sheetName = workbook.SheetNames[0];
   const worksheet = workbook.Sheets[sheetName];
   const csvData = xlsx.utils.sheet_to_csv(worksheet);
   return csvData;
}

export default {
   downloadFile,
   convertToCSV
};