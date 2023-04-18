const mysql = require('mysql')
const config = require('./config.json')

// CHANGE DATABASE NAME
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
  });

  connection.connect((err) => err && console.log(err));

// ADD ROUTES



// ADD ROUTE VARS BELOW
// module.exports = {

// }

