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

const search_artists = async function(req, res) {
  // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
  // Some default parameters have been provided for you, but you will need to fill in the rest
  const name = req.query.name ?? '';

  connection.query(`
    SELECT *
      FROM Artist
      WHERE artist LIKE '%${name}%' 
      ORDER BY artist ASC
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json([...data]);
    }
  }); // replace this with your implementation
}

const search_albums = async function(req, res) {
  // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
  // Some default parameters have been provided for you, but you will need to fill in the rest
  const name = req.query.name ?? '';

  connection.query(`
    SELECT *
      FROM Albums
      WHERE Title LIKE '%${name}%' 
      ORDER BY Title ASC
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json([...data]);
    }
  }); // replace this with your implementation
}

const search_songs = async function(req, res) {
  // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
  // Some default parameters have been provided for you, but you will need to fill in the rest
  const name = req.query.name ?? '';

  connection.query(`
    SELECT *
      FROM Song
      WHERE name LIKE '%${name}%' 
      ORDER BY name ASC
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json([...data]);
    }
  }); // replace this with your implementation
}



// ADD ROUTE VARS BELOW
module.exports = {
  search_artists,
  search_albums,
  search_songs,
}

