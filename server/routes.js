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
      FROM Album
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
      WHERE country IS NOT NULL
      GROUP BY country
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
    FROM Song
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
    ORDER BY name
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

const top_artist_by_country = async function(req, res) {
  connection.query(`
  WITH artists_in_album AS (
    SELECT alb.artist AS Artist, alb.Metacritic_Critic_Score AS critic_score
    FROM Album alb
    WHERE alb.Metacritic_Critic_Score IS NOT NULL
  ),
  max_artist AS (
      SELECT artist, country, listeners
      FROM Artist
      WHERE artist = ANY (SELECT Artist FROM artists_in_album)
  )
  SELECT a.artist AS artist, a.country, MAX(a.listeners) AS listeners, b.critic_score
  FROM max_artist a, artists_in_album b
  WHERE UPPER(b.Artist) = UPPER(a.artist)
  GROUP BY country
  ORDER BY listeners DESC;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      console.log(data);
      res.json(data);
    }
  }); 
}

const rating_threshold_count = async function(req, res) {
  const threshold = req.query.threshold ?? 0;

  connection.query(`
    SELECT Artist, COUNT(*) AS Num_Ratings
    FROM Review
    WHERE Rating >= ${threshold}
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

const average_rating_artist_all = async function(req, res) {
  connection.query(`
  SELECT Artist, AVG(Rating) AS AvgRating
  FROM Review
  GROUP BY Artist
  ORDER BY AvgRating DESC
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  }); 
}

const average_rating_artist = async function(req, res) {
  const artist = req.params.artist ?? ''
  connection.query(`
  SELECT Artist, AVG(Rating) AS AvgRating
  FROM Review
  WHERE Artist = ${artist}
  GROUP BY Artist
  ORDER BY AvgRating DESC
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  }); 
}

const average_albums = async function(req, res) {
  connection.query(`
  WITH meta AS (
    SELECT Title, Artist, Metacritic_Critic_Score AS
        critic_score, Metacritic_User_Score AS user_score
    FROM Album
  ),
  critic_reviews AS (
    SELECT Title, Artist, AVG(Rating) as review_scores
    FROM Review
    GROUP BY Artist, Title
  ),
  albums AS (
    SELECT album, artist,
        AVG(danceability) AS danceability, AVG(energy) AS energy,
        AVG(loudness) AS loudness, AVG(speechiness) AS speechiness,
        AVG(acousticness) AS acousticness, AVG(instrumentalness) AS instrumentalness,
        AVG(liveness) AS liveness, AVG(valence) AS valence,
        AVG(tempo) AS tempo, SUM(duration_ms) / 60000 AS duration_min, release_date
    FROM SongAlbum
    GROUP BY album
  )
  SELECT m.Title, m.Artist, m.critic_score, m.user_score,
      cr.review_scores, a.danceability, a.energy, a.loudness,
      a.speechiness, a.acousticness, a.instrumentalness,
      a.liveness, a.valence, a.tempo, a.duration_min, a.release_date
  FROM meta m JOIN critic_reviews cr ON m.Title = cr.Title
  JOIN albums a ON m.Title = a.album
  GROUP BY m.Title, m.Artist
  ORDER BY m.critic_score DESC;
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
    FROM Artist
    ORDER BY listeners DESC
    LIMIT 100
),
top_albums AS (
    SELECT album, SongAlbum.artist,
        AVG(danceability) AS danceability, SUM(duration_ms) / 6000 AS duration_min, release_date
    FROM SongAlbum JOIN top_100 ON SongAlbum.artist = top_100.artist
    WHERE release_date IS NOT NULL AND
        release_date <> 0000 AND
        release_date >= '${dateLow}' AND
        release_date <= '${dateHigh}'
    GROUP BY album
  ),
  meta AS (
      SELECT Title, Artist, Metacritic_Critic_Score AS critic_score,
          Metacritic_Reviews AS critic_reviews, Metacritic_User_Score AS user_score,
          Metacritic_User_Reviews AS user_reviews
      FROM Album
  )
  SELECT t100.artist, t100.country, t100.tags, t100.listeners,
      ta.album, ta.danceability, ta.duration_min,
      ta.release_date, m.critic_score, m.critic_reviews,
      m.user_score, m.user_reviews
  FROM top_100 t100 JOIN top_albums ta
      ON ta.artist = t100.artist
      JOIN meta m ON t100.artist = m.Artist
  GROUP BY ta.album, t100.artist
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

const highest_rated_albums_per_artist = async function(req, res) {
  connection.query(`
  WITH album_mc_scores AS (
    SELECT Title, Metacritic_User_Score
    FROM Album
    WHERE Metacritic_User_Score IS NOT NULL
  ),
  max_album AS (
      SELECT a.Artist, a.Title, MAX(a.avg_rating) AS avg_rating
      FROM (
          SELECT Artist, Title, AVG(Rating) AS avg_rating
          FROM Review
          GROUP BY Artist, Title
      ) a
      GROUP BY a.Artist
  ),
  qualities_rating AS (
      SELECT a.Artist AS artist, a.Title AS album, b.avg_dance as avg_dance, a.avg_rating AS avg_rating
      FROM max_album a JOIN (
          SELECT album, AVG(danceability) AS avg_dance
          FROM SongAlbum
          GROUP BY album
      ) b
          ON a.Title = b.album
      GROUP BY a.Title
  )
  SELECT a.artist AS artist, a.album AS album, a.avg_dance AS avg_dance, a.avg_rating AS avg_rating, b.Metacritic_User_Score AS Metacritic_User_Score
  FROM qualities_rating a JOIN album_mc_scores b
      ON a.album = b.Title
  ORDER BY avg_dance, avg_rating, Metacritic_User_Score
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  }); 
}

const average_country_rating = async function(req, res) {
  connection.query(`
    SELECT country, AVG(Rating) AS avgRating
    FROM Review JOIN Artist ON Artist.artist = Review.Artist
    GROUP BY country
    ORDER BY AVG(Rating) DESC
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  }); 
}

module.exports = {
  search_artists,
  search_albums,
  search_songs,
  num_artists_by_country,
  search_songs_advanced,
  top_artist_by_country,
  rating_threshold_count,
  average_rating_artist_all,
  average_rating_artist,
  average_albums,
  top_albums_in_range,
  highest_rated_albums_per_artist,
  average_country_rating
}
