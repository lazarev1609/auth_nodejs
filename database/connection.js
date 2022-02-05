const mysql = require('mysql2');

const connection = mysql.createPool({
            connectionLimit: 5,
            host: "localhost",
            user: "root",
            password: "",
            database: "auth_nodejs"
});

module.exports = { 
    connection: connection
}