const mysql = require('mysql')
const config = require('./config.json')

const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});

connection.connect((err) => err && console.log(err));


const search_artists = async function(req, res) {
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
      res.json(data);
    }
  });
}

const search_albums = async function(req, res) {
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
      res.json(data);
    }
  });
}

const search_songs = async function(req, res) {
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
      res.json(data);
    }
  }); 
}

const num_artists_by_country = async function(req, res) {

  connection.query(`
    SELECT country, COUNT(artist) AS numArtists
      FROM Artist
      GROUP BY country
      WHERE country IS NOT NULL
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
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

const rating_threshold_count = async function(req, res) {
  const threshold = req.query.threshold ?? 0;

  connection.query(`
    SELECT Artist, COUNT(*) AS Num_Ratings
    FROM Reviews
    WHERE Rating > ${threshold}
    GROUP BY Artist
    ORDER BY COUNT(*) DESC
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  }); 
}

const top_albums_in_range = async function(req, res) {
  const dateLow = req.query.date_low ?? '1900-01-01'
  const dateHigh = req.query.date_high ?? '2020-12-31'
  connection.query(`
    WITH top_100 AS (
      SELECT artist, country, tags, listeners
      FROM Artists
      ORDER BY listeners DESC
      LIMIT 100
    ),
    top_albums AS (
      SELECT DISTINCT album, artists, AVG(danceability) AS
        danceability, SUM(duration_ms) / 6000 AS
        duration_min, release_date
      FROM Songs, top_100
      GROUP BY album
      WHERE (artists LIKE '%' + top_100.artist + '%') AND
         (release_date >= ${dateLow}) AND
         (release_date <= ${dateHigh})
    ),
    meta AS (
      SELECT Artist, DISTINCT Title, 'Metacritic Critic Score' AS 
          critic_score, 'Metacritic Reviews' AS
      critic_reviews, 'Metacritic User Score' AS
      user_score, 'Metacritic User Reviews' AS
      user_reviews
      FROM Ratings
    )
    SELECT t100.artist, t100.country, t100.tags, t100.listeners, 
        ta.album, ta.danceability, ta.duration_min,
      ta.release_date, m.critic_score, m.critic_reviews,
      m.user_score, m.user_reviews
    FROM top_100 t100 JOIN top_albums ta 
       ON ta.artists LIKE '%' + t100.artist + '%'
       JOIN meta m ON t100.artist = m.Artist
    `, (err, data) => {
    if (err || data.length === 0) {
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
  num_artists_by_country,
  search_songs_advanced,
  rating_threshold_count,
  top_albums_in_range,
}
