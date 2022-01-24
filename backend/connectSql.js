const mysql = require("mysql");
require('dotenv').config();

// connection a la DB
const connection = mysql.createConnection({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWD,
  database: process.env.SQL_DB,
});
//test dans la console
connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("MYSQL connected !! ");
});
module.exports = connection;