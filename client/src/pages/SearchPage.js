import { useEffect, useState } from 'react';
import { Button, Switch, Container, FormControl, FormControlLabel, Grid, Slider, TextField, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { formatDuration } from '../helpers/formatter';

const config = require('../config.json');

export default function SearchPage() {

  // define all variables for page
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [dance, setDance] = useState([0, 1]);
  const [energy, setEnergy] = useState([0, 1]);
  const [loud, setLoud] = useState([-60, 10]);
  const [speech, setSpeech] = useState([0, 1]);
  const [acoustic, setAcoustic] = useState([0, 1]);
  const [instrument, setInstrument] = useState([0, 1]);
  const [live, setLive] = useState([0, 1]);
  const [valence, setValence] = useState([0, 1]);
  const [tempo, setTempo] = useState([0, 250]);
  const [duration, setDuration] = useState([0, 6100000]);

  // 0=song, 1=artist, 2=album
  const [searchType, setSearchType] = useState(0);
  const [searchAdvanced, setSearchAdvanced] = useState(false);

  //hooks for each component on search page
  //hook for rendering components that display search results of searching for song, artist, or album
  useEffect(() => {
    setName('');
    setSearchAdvanced(false);

    //routes to url for searching for songs (default state)
    if (searchType === 0) {
      fetch(`http://${config.server_host}:${config.server_port}/searchSongs`)
      .then(res => res.json())
      .then(resJson => {
        const songsWithId = resJson.map((song) => ({ id: song.id, ...song }));
        setData(songsWithId);
      });
    
    //routes to url for searching for artists (default state)
    } else if (searchType === 1) {
      fetch(`http://${config.server_host}:${config.server_port}/searchArtists`)
      .then(res => res.json())
      .then(resJson => {
        const artistsWithId = resJson.map((artist) => ({ id: artist.artist, ...artist }));
        setData(artistsWithId);
      });
    
    //routes to url for searching for albums (default state)
    } else {
      fetch(`http://${config.server_host}:${config.server_port}/searchAlbums`)
      .then(res => res.json())
      .then(resJson => {
        const albumsWithId = resJson.map((album) => ({ id: album.Title, ...album }));
        setData(albumsWithId);
      });
    }
  }, [searchType]);


  const search = () => {
    //routes to url for searching for songs with specific input WITHOUT advanced search
    if (searchType === 0 && !searchAdvanced) {
      fetch(`http://${config.server_host}:${config.server_port}/searchSongs?name=${name}`)
      .then(res => res.json())
      .then(resJson => {
        const songsWithId = resJson.map((song) => ({ id: song.id, ...song }));
        setData(songsWithId);
      });

    //routes to url for searching for songs with specific input WITH advanced search inputs
    } else if (searchType === 0 && searchAdvanced) {
      fetch(`http://${config.server_host}:${config.server_port}/searchSongsAdvanced?name=${name}` +
        `&dance_low=${dance[0]}&dance_high=${dance[1]}` +
        `&energy_low=${energy[0]}&energy_high=${energy[1]}` +
        `&loud_low=${loud[0]}&loud_high=${loud[1]}`+
        `&speech_low=${speech[0]}&speech_high=${speech[1]}` +
        `&acoustic_low=${acoustic[0]}&acoustic_high=${acoustic[1]}` +
        `&instrument_low=${instrument[0]}&instrument_high=${instrument[1]}` +
        `&live_low=${live[0]}&live_high=${live[1]}` +
        `&valence_low=${valence[0]}&valence_high=${valence[1]}` +
        `&tempo_low=${tempo[0]}&tempo_high=${tempo[1]}` +
        `&duration_low=${duration[0]}&duration_high=${duration[1]}`
      )
      .then(res => res.json())
      .then(resJson => {
        const artistsWithId = resJson.map((artist) => ({ id: artist.artist, ...artist }));
        setData(artistsWithId);
      });
    
    //routes to url for searching for artists with specific input 
    } else if (searchType === 1) {
      fetch(`http://${config.server_host}:${config.server_port}/searchArtists?name=${name}`)
      .then(res => res.json())
      .then(resJson => {
        const artistsWithId = resJson.map((artist) => ({ id: artist.artist, ...artist }));
        setData(artistsWithId);
      });
    
    //routes to url for searching for albums with specific input
    } else {
      fetch(`http://${config.server_host}:${config.server_port}/searchAlbums?name=${name}`)
      .then(res => res.json())
      .then(resJson => {
        const albumsWithId = resJson.map((album) => ({ id: album.Title, ...album }));
        setData(albumsWithId);
      });
    }
  }

  //column definitions for each component
  //columns for song search results
  const songColumns = [
    { field: 'name', headerName: 'Name', width: 200},
    { field: 'artist', headerName: 'Artists', width: 400},
    { field: 'album', headerName: 'Album' , width: 300},
    { field: 'duration_ms', headerName: 'Length (ms)', width: 100},
    { field: 'release_date', headerName: 'Release Date', width: 130},
  ]

  //columns for artist search results
  const artistColumns = [
    { field: 'artist', headerName: 'Artist', width: 300},
    { field: 'country', headerName: 'Country', width: 150},
    { field: 'tags', headerName: 'Genres' , width: 600},
    { field: 'listeners', headerName: 'Listeners' }
  ]

  //columns for album search results
  const albumColumns = [
    { field: 'Title', headerName: 'Title', width: 400},
    { field: 'Artist', headerName: 'Artist', width: 400},
    { field: 'Release_Year', headerName: 'Year' , width: 100},
    { field: 'Genre', headerName: 'Genre', width: 200}
  ]

  //returns desired columns based on drop down selection (song, artist, album)
  const columns = columnType => {
    if (columnType === 0) return songColumns;
    else if (columnType === 1) return artistColumns;
    else return albumColumns;
  }

  /*creates dropdown menu component that allows user to pick between searching for songs, 
  artists, or albums */
  const SearchTypeSelector = () => (
    <FormControl fullWidth>
      <InputLabel id="search-type-select-label">Type</InputLabel>
      <Select
        labelId="search-type-select-label"
        id="search-type-select"
        value={searchType}
        label="Type"
        onChange={e => setSearchType(e.target.value)}
      >
        {/* assigns song to value 0, artist to value 1, album to value 2 */}
        <MenuItem value={0}>Song</MenuItem>
        <MenuItem value={1}>Artist</MenuItem>
        <MenuItem value={2}>Album</MenuItem>
      </Select>
    </FormControl>
  )

  /*creates dropdown menu component that allows user to perform advanced song search
  with multiple inputs including danceability, energy, loudness, etc. */
  const AdvancedOptions = (
    <>
      {/* slider for danceability */}
      <Grid item xs={4}>
        <p>Danceability</p>
        <Slider
          value={dance}
          min={0}
          max={1}
          step={0.025}
          onChange={(e, newValue) => setDance(newValue)}
          valueLabelDisplay='auto'
        />
      </Grid>

      {/* slider for energy */}
      <Grid item xs={4}>
        <p>Energy</p>
        <Slider
          value={energy}
          min={0}
          max={1}
          step={0.025}
          onChange={(e, newValue) => setEnergy(newValue)}
          valueLabelDisplay='auto'
        />
      </Grid>

      {/* slider for loudness */}
      <Grid item xs={4}>
        <p>Loudness</p>
        <Slider
          value={loud}
          min={-60}
          max={10}
          step={2}
          onChange={(e, newValue) => setLoud(newValue)}
          valueLabelDisplay='auto'
        />
      </Grid>

      {/* slider for speechiness */}
      <Grid item xs={4}>
        <p>Speechiness</p>
        <Slider
          value={speech}
          min={0}
          max={1}
          step={0.025}
          onChange={(e, newValue) => setSpeech(newValue)}
          valueLabelDisplay='auto'
        />
      </Grid>

      {/* slider for acousticness */}
      <Grid item xs={4}>
        <p>Acousticness</p>
        <Slider
          value={acoustic}
          min={0}
          max={1}
          step={0.025}
          onChange={(e, newValue) => setAcoustic(newValue)}
          valueLabelDisplay='auto'
        />
      </Grid>

      {/* slider for instrumentalness */}
      <Grid item xs={4}>
        <p>Instrumentalness</p>
        <Slider
          value={instrument}
          min={0}
          max={1}
          step={0.025}
          onChange={(e, newValue) => setInstrument(newValue)}
          valueLabelDisplay='auto'
        />
      </Grid>

      {/* slider for liveness */}
      <Grid item xs={4}>
        <p>Liveness</p>
        <Slider
          value={live}
          min={0}
          max={1}
          step={0.025}
          onChange={(e, newValue) => setLive(newValue)}
          valueLabelDisplay='auto'
        />
      </Grid>

      {/* slider for valence */}
      <Grid item xs={4}>
        <p>Valence</p>
        <Slider
          value={valence}
          min={0}
          max={1}
          step={0.025}
          onChange={(e, newValue) => setValence(newValue)}
          valueLabelDisplay='auto'
        />
      </Grid>

      {/* slider for tempo */}
      <Grid item xs={4}>
        <p>Tempo</p>
        <Slider
          value={tempo}
          min={0}
          max={250}
          step={5}
          onChange={(e, newValue) => setTempo(newValue)}
          valueLabelDisplay='auto'
        />
      </Grid>

      {/* slider for duration */}
      <Grid item xs={4}>
        <p>Duration</p>
        <Slider
          value={duration}
          min={60}
          max={660}
          step={10}
          onChange={(e, newValue) => setDuration(newValue)}
          valueLabelDisplay='auto'
          valueLabelFormat={value => <div>{formatDuration(value)}</div>}
        />
      </Grid>
    </>
  )

  // renders page fully with all components put together
  return (
    <Container>
      <h2>Search!</h2>
      <Grid container spacing={6}>

        {/* renders search bar */}
        <Grid item xs={7}>
          <TextField label='Name' value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%" }}/>
        </Grid>

        {/* renders dropdown menu */}
        <Grid item xs={3}>
          <SearchTypeSelector />
        </Grid>

        {/* renders switch for advanced song search option */}
        {searchType === 0 && 
          <Grid item xs={2}>
            <FormControlLabel 
              value="top"
              control={<Switch checked={searchAdvanced} onChange={e => setSearchAdvanced(!searchAdvanced)}/>}
              label="Advanced"
              labelPlacement="top"
            />
          </Grid>
        }
        {searchAdvanced && AdvancedOptions}
      </Grid>

      {/* renders search button */}
      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>

      {/* renders table with results of search */}
      <h2>Results</h2>
      <DataGrid
        getRowId={(row) => (Math.random() * 100)}
        rows={data}
        columns={columns(searchType)}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}