import mysql2 from 'mysql2/promise';

const connectionPool = mysql2.createPool({
   host: 'localhost',
   port: 3306,
   user: process.env.db_username,
   password: process.env.db_password,
   database: 'bokdb'
});

async function getConnection() {
   try {
      const connection = await connectionPool.getConnection();
      return connection;
   } catch (error) {
      console.error('Ett fel uppstod', error);
   }
}

export default {
   getConnection
};