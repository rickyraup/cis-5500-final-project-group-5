import { useEffect, useState } from 'react';
import { Divider, Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker' 

const config = require('../config.json');

export default function AlbumsPage() {
  const [pageSize, setPageSize] = useState(10)
  const [dateLow, setDateLow] = useState(dayjs('01-01-1990'))
  const [dateHigh, setDateHigh] = useState(dayjs('12-31-2020'))
  const [genreType, setGenreType] = useState('')
  const [avgData, setAvgData] = useState([])
  const [topData, setTopData] = useState([])
  const [genreData, setGenreData] = useState([])

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/averageAlbums`)
    .then(res => res.json())
    .then(resJson => setAvgData(resJson))
  }, [])

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/topAlbumsInRange?date_low=${dateLow.format('YYYY-MM-DD')}&date_high=${dateHigh.format('YYYY-MM-DD')}`)
    .then(res => res.json())
    .then(resJson => setTopData(resJson))
  }, [dateLow, dateHigh])

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/topRecentAlbumsGenre`)
    .then(res => res.json())
    .then(resJson => setGenreData(resJson))
  }, [])

  const searchGenre = () => {
    fetch(`http://${config.server_host}:${config.server_port}/topRecentAlbumsGenre?genre=${genreType}`)
    .then(res => res.json())
    .then(resJson => setGenreData(resJson))
  }
  
  const avgColumns = [
    // { field: 'Title', headerName: 'Title', width: 400, renderCell: (params) => (
    //     // <Link onClick={() => setSelectedSongId(params.row.artist)}>{params.value}</Link>
    // ) },
    { field: 'Title', headerName: 'Title', width: 400},
    { field: 'Artist', headerName: 'Artist', width: 400},
    { field: 'critic_score', headerName: 'Critic Score' , width: 100},
    { field: 'user_score', headerName: 'User Score', width: 100},
    { field: 'review_scores', headerName: 'Review Score', width: 150},
    { field: 'danceability', headerName: 'Danceability', width: 150},
    { field: 'duration_min', headerName: 'Length (min)', width: 150},
    { field: 'release_date', headerName: 'Release Date', width: 150},
  ]
  const topColumns = [
    // { field: 'Title', headerName: 'Title', width: 400, renderCell: (params) => (
    //     // <Link onClick={() => setSelectedSongId(params.row.artist)}>{params.value}</Link>
    // ) },
    { field: 'album', headerName: 'Title', width: 400},
    { field: 'artist', headerName: 'Artist', width: 400},
    { field: 'country', headerName: 'Country' , width: 200},
    { field: 'tags', headerName: 'Tags', width: 400},
    { field: 'listeners', headerName: 'Listeners', width: 100},
    { field: 'danceability', headerName: 'Danceability', width: 100},
    { field: 'duration_min', headerName: 'Length (min)', width: 100},
    { field: 'release_date', headerName: 'Release Date', width: 150},
    { field: 'critic_score', headerName: 'Critic Score', width: 100},
    { field: 'critic_reviews', headerName: 'Critic Reviews', width: 120},
    { field: 'user_score', headerName: 'User Score', width: 100},
    { field: 'user_reviews', headerName: 'User Reviews', width: 100},
  ]

  const genreColumns = [
    // { field: 'Title', headerName: 'Title', width: 400, renderCell: (params) => (
    //     // <Link onClick={() => setSelectedSongId(params.row.artist)}>{params.value}</Link>
    // ) },
    { field: 'Title', headerName: 'Title', width: 400},
    { field: 'Artist', headerName: 'Artist', width: 400},
    { field: 'avg_rating', headerName: 'Average Rating' , width: 300},
  ]

  

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Container>
      <h2>General Album Statistics</h2>
      <DataGrid
        getRowId={(row) => row.Title}
        rows={avgData}
        columns={avgColumns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
      <Divider />
      <h2>Find Albums from the Top 100 All-Time Artists!</h2>

      <DatePicker
        label="Start Date"
        value={dateLow}
        onChange={(newValue) => setDateLow(newValue)}
      />
      <DatePicker
        label="End Date"
        value={dateHigh}
        onChange={(newValue) => setDateHigh(newValue)}
      />
      <div>(Dates range from 1/1/1990 to 12/31/2020)</div>
      <br />
      <DataGrid
        getRowId={(row) => row.album}
        rows={topData}
        columns={topColumns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
      <Divider />
      <h2>Find the Top Albums of the 21st Century by Genre!</h2>
      <TextField id="outlined-basic" label="Genre" variant="outlined" value={genreType} onChange={e => setGenreType(e.target.value)}/>
      <br />
      <Button onClick={()=>searchGenre()}>
         Search
      </Button>
      <br />
      <DataGrid
        getRowId={(row) => row.Title}
        rows={genreData}
        columns={genreColumns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
    </LocalizationProvider>
  )
}