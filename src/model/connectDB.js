import mysql from 'mysql2/promise';
import cleanup, { registerCleanupItem } from '../environment/cleanup.js';

let connection = null;
 
async function connectDB() {

    cleanupDB();
    
    // from the command line if we want
    //CLI: sudo /usr/local/mysql/bin/mysqld_safe --user=mysql &
    //     mysql -u root -p

    try {
        console.log(`Connecting to MySQL database...    S
                   host: ${process.env.MYSQLHOST} 
                   user: ${process.env.MYSQLUSER}
                    password: ${process.env.MYSQL_PWD}   
                   database: ${process.env.MYSQLDATABASE}`);
        
        // Create Connection Object
        connection = await mysql.createConnection({
          host: process.env.MYSQLHOST, // or your database server IP
          user: process.env.MYSQLUSER, // your MySQL username
          password: process.env.MYSQL_PWD,
          database: process.env.MYSQLDATABASE,
        });
        
        registerCleanupItem(cleanupDB);  // put our db cleanup on cleanup stack
        
        // ✅ Confirm Connection
        console.log('Connected to MySQL database: languages');
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

export { connection };
export default connectDB;
