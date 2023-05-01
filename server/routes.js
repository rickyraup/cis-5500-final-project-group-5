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
  CREATE INDEX listeners_index
  ON Artists(listeners);
  
  WITH top_in_country AS (
    SELECT a1.country, MAX(a1.listeners) AS listeners
    FROM Artists a1
    JOIN (
    SELECT a2.artist, a2.tags
    FROM Artists a2
    WHERE (a1.country = a2.country) AND
      (a2.listeners = MAX(a1.listeners))
  ) info ON a1.country = info.country
    GROUP BY country
  )
  SELECT tic.country, tic.artist, tic.tags, tic.listeners,
    rat.Title AS album, ‘Metacritic Critic Score’ AS
    critic_score
  FROM top_in_country tic JOIN Ratings rat
  ON UPPER(tic.artist) = UPPER(rat.Artist)  
  `, (err, data) => {
    if (err || data.length === 0) {
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
    FROM Review
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

const average_rating_artist_all = async function(req, res) {
  connection.query(`
  SELECT Artist, AVG(Rating) AS AvgRating
  FROM Reviews
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
  FROM Reviews
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
    SELECT Artist, DISTINCT Title, ‘Metacritic Critic Score’ AS 
        critic_score, ‘Metacritic User Score’ AS
        user_score
    FROM Ratings
  ),
  critic_reviews AS (
    SELECT Artist, DISTINCT Title, AVG(Rating) as review_scores
    FROM Reviews
    GROUP BY (Artist, Title)
  ),
  albums AS (
    SELECT DISTINCT album, artists, AVG(danceability) AS
    danceability, SUM(duration_ms) / 6000 AS
    duration_min, release_date
  FROM Songs
  GROUP BY album
  ),
  SELECT m.Title, m.Artist, m.critic_score, m.user_score, 
      cr.review_scores, a.danceability, a.duration_min,
      a.release_date
  FROM meta m JOIN critic_reviews cr ON m.Title = cr.Title
  JOIN albums a ON m.Title = a.album 
  ORDER BY m.critic_score DESC  
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
         (release_date IS NOT NULL) AND
         (DATE <> '0000') AND
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

const highest_rated_albums_per_artist = async function(req, res) {
  connection.query(`
    WITH avg_ratings AS (
      SELECT Artist, Title, AVG(Rating)AS avg_rating
      FROM Reviews
      GROUP BY Artist, Title
    ),
    album_mc_scores AS (
      SELECT Album, Metacritic_User_Score
      FROM Albums
    ), 
    max_album AS (
      SELECT a.Artist, a.Title, a.avg_rating
      FROM avg_ratings a
      WHERE avg_rating = MAX(SELECT MAX(b.avg_rating)
                FROM avg_ratings b
                WHERE a.Artist = b.Artist
    ),
    danceabilities AS (
      SELECT album, AVG(danceability) AS avg_dance
      FROM Song
      GROUP BY album
    ),
    dance_and_rating AS (
      SELECT a.Artist AS artist, a.Title AS album, b.avg_dance as avg_dance, a.avg_rating AS avg_rating
      FROM max_album a JOIN danceabilities b
                      ON a.Title = b.album
    ),
    SELECT a.artist AS artist, a.album AS album, a.avg_dance AS avg_dance, a.avg_rating AS avg_rating, b.Metacritic_User_Score AS Metacritic_User_Score
    FROM dance_and_rating a JOIN album_mc_scores b
                ON a.album = b.Album
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
    SELECT AVG(Rating), country
    FROM Reviews JOIN Artist ON Artist.artist = Reviews.Artist
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
