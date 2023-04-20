const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();

app.use(cors({
  origin: '*',
}));

// ADD ROUTE REQUESTS HERE
app.get('/searchArtists', routes.search_artists);
app.get('/searchAlbums', routes.search_albums);
app.get('/searchSongs', routes.search_songs);


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;