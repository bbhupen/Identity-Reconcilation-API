const mysql = require('mysql');

const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD
const MYSQL_HOST = process.env.MYSQL_HOST
const MYSQL_USER = process.env.MYSQL_USER
const MYSQL_DB = process.env.MYSQL_DB

const dbConnection  = mysql.createPool({
    connectionLimit : 10,
    acquireTimeout  : 10000,
    host            : MYSQL_HOST,
    user            : MYSQL_USER,
    password        : MYSQL_PASSWORD,
    database        : MYSQL_DB,
    charset        : 'utf8mb4',
    timezone       : 'Z',
  });

module.exports = {
  dbConnection
}