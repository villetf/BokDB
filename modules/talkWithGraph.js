import 'dotenv/config';
import axios from 'axios';
import querystring from 'querystring';
import fs from 'fs';

async function getToken() {
   const body = {
      client_id: process.env.client_id,
      client_secret: process.env.client_secret,
      refresh_token: fs.readFileSync('./refresh_token', 'utf-8'),
      grant_type: 'refresh_token'
   };
   const encodedBody = querystring.stringify(body);
   const response = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', encodedBody);
   return [response.data.access_token, response.data.refresh_token];
}

async function getLink(token) {
   const response = await axios.get(`https://graph.microsoft.com/v1.0/shares/u!${process.env.share_id}/driveItem`, {
      headers: {
         'Authorization': `Bearer ${token}`
      }
   });
   return response.data['@microsoft.graph.downloadUrl'];
}



export default {
   getToken,
   getLink
};