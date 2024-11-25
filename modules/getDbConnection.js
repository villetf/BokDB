import mysql2 from 'mysql2/promise';
import helpers from './helpers.js';

const connectionPool = mysql2.createPool({
   host: 'localhost',
   port: 3306,
   user: process.env.db_username,
   password: process.env.db_password,
   database: 'bokdb'
});

export async function getConnection() {
   try {
      const connection = await connectionPool.getConnection();
      return connection;
   } catch (error) {
      helpers.logError(error, 'Fel vid skapande av anslutningspool');
   }
}

export default {
   getConnection
};