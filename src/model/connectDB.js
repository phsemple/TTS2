import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import cleanup, { registerCleanupItem } from '../environment/cleanup.js';
import { join } from "path";
import { __dirname,__filename } from '../../public/globalVars.js';

let connection = null;
 
async function connectDB() {

    // this makes sure the database is built and populated with
    // initial data. Only does anything if newly deployed.
    await dbInitialize();

    cleanupDB();  // make sure database connection is closed
    
    // from the command line if we want
    //CLI: sudo /usr/local/mysql/bin/mysqld_safe --user=mysql &
    //     mysql -u root -p

    try {
        
        // Connect to the initialized database.
        connection = await mysql.createConnection({
          host: process.env.MYSQLHOST, // or your database server IP
          user: process.env.MYSQLUSER, // your MySQL username
          password: process.env.MYSQLPASSWORD,
          database: process.env.MYSQLDATABASE,
          multipleStatements: true,
        });
        
        // put our cleanupDB on cleanup stack in the enviroment cleanup
        registerCleanupItem(cleanupDB);
        
        // ✅ Confirm Connection
        console.log(`Connected to MySQL database: ${process.env.MYSQLDATABASE}`);
    } catch (error) {
        console.log(`ConnectDB: Error ${error}`)
    }

}

function cleanupDB() {

        if (connection && !connection.destroyed) {
            console.log('🚀 Closing MySQL Connection...');
            connection.end().then(() => console.log('✅ MySQL Connection Closed'));
    }
}

async function dbInitialize() {
     
    connection = await mysql.createConnection({
      host: process.env.MYSQLHOST, // or your database server IP
      user: process.env.MYSQLUSER, // your MySQL username
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      multipleStatements: true,
    });

    try {
        const [rows, fields] = await connection.query(`SHOW TABLES LIKE ?`, ['langcodes'])
        console.log('dbInitialize: Connect Query results:', rows);

        if (rows.length > 0) {
            return; // all good
        }
 
        await buildDb(); // build the database
        
    } catch (err) {
        console.error('Error during connection query:', err);
    }

}

// build the database. If localhost we create the instance
async function buildDb() {
    try {

        const path = process.env.SQLSCRIPTS_PATH;
        const host = process.env.MYSQLHOST;
        console.log(`Build Database running on host: ${host}`)

        // Table builds
        const sqlFilePath = join(__dirname, `${path}`, "languages.sql");
        const sqlScript = await fs.readFile(sqlFilePath, "utf8");
        const [results] = await connection.query(sqlScript);
        console.log('Database Built:', results);

        // data builds
        const dataFilePath = join(__dirname, `${path}`, "loadData.sql");
        const dataSqlScript = await fs.readFile(dataFilePath, "utf8");
        const [dataResults] = await connection.query(dataSqlScript);
        console.log("Database data loaded:", dataResults);       

  } catch (error) {
        console.log('Error executing in buildDB() SQL script:', error);
  }

}

export { connection };
export default connectDB;
