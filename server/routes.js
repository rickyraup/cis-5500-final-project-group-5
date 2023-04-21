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

const search_songs_advanced = async function(req, res) {
  const name = req.query.name ?? '';
  const danceLow = req.query.dance_low ?? 0;
  const danceHigh = req.query.dance_high ?? 1;
  const energyLow = req.query.energy_low ?? 0;
  const energyHigh = req.query.energy_high ?? 1;
  const loudLow = req.query.loud_low ?? -60;
  const loudHigh = req.query.loud_high ?? 10;
  const speechLow = req.query.speech_low ?? 0;
  const speechHigh = req.query.speech_high ?? 1;
  const acousticLow = req.query.acoustic_low ?? 0;
  const acousticHigh = req.query.acoustic_high ?? 1;
  const instrumentLow = req.query.instrument_low ?? 0;
  const instrumentHigh = req.query.instrument_high ?? 1;
  const liveLow = req.query.live_low ?? 0;
  const liveHigh = req.query.live_high ?? 1;
  const valenceLow = req.query.valence_low ?? 0;
  const valenceHigh = req.query.valence_high ?? 1;
  const tempoLow = req.query.tempo_low ?? 0;
  const tempoHigh = req.query.tempo_high ?? 250;
  const durationLow = req.query.duration_low ?? 0;
  const durationHigh = req.query.duration_high = 6100000;

  connection.query(`
    SELECT *
    FROM Songs
    WHERE name LIKE '%${name}%'
      AND danceability BETWEEN ${danceLow} AND ${danceHigh}
      AND energy BETWEEN ${energyLow} AND ${energyHigh}
      AND loudness BETWEEN ${loudLow} AND ${loudHigh}
      AND speechiness BETWEEN ${speechLow} AND ${speechHigh}
      AND acousticness BETWEEN ${acousticLow} AND ${acousticHigh}
      AND instrumentalness BETWEEN ${instrumentLow} AND ${instrumentHigh}
      AND liveness BETWEEN ${liveLow} AND ${liveHigh}
      AND valence BETWEEN ${valenceLow} AND ${valenceHigh}
      AND tempo BETWEEN ${tempoLow} AND ${tempoHigh}
      AND duration_ms BETWEEN ${durationLow} AND ${durationHigh}
    ORDER BY title
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}



// ADD ROUTE VARS BELOW
module.exports = {
  search_artists,
  search_albums,
  search_songs,
  search_songs_advanced,
}

