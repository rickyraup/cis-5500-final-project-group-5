import { useEffect, useState } from 'react';
import { Divider, Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function AlbumsPage() {
  const [pageSize, setPageSize] = useState(10)
  const [avgData, setAvgData] = useState([])
  const [topData, setTopData] = useState([])

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/averageAlbums`)
    .then(res => res.json())
    .then(resJson => setAvgData(resJson))

    fetch(`http://${config.server_host}:${config.server_port}/topAlbumsInRange`)
    .then(res => res.json())
    .then(resJson => setTopData(resJson))
  }, [])
  const avgColumns = [
    // { field: 'Title', headerName: 'Title', width: 400, renderCell: (params) => (
    //     // <Link onClick={() => setSelectedSongId(params.row.artist)}>{params.value}</Link>
    // ) },
    { field: 'Title', headerName: 'Title', width: 400},
    { field: 'Artist', headerName: 'Artist', width: 400},
    { field: 'critic_score', headerName: 'Critic Score' , width: 100},
    { field: 'user_score', headerName: 'User Score', width: 100},
    { field: 'review_scores', headerName: 'Review Score', width: 100},
    { field: 'danceability', headerName: 'Danceability', width: 100},
    { field: 'duration_min', headerName: 'Length (min)', width: 100},
    { field: 'release_date', headerName: 'Release Date', width: 100},
  ]
  const topColumns = [
    // { field: 'Title', headerName: 'Title', width: 400, renderCell: (params) => (
    //     // <Link onClick={() => setSelectedSongId(params.row.artist)}>{params.value}</Link>
    // ) },
    { field: 'album', headerName: 'Title', width: 400},
    { field: 'artist', headerName: 'Artist', width: 400},
    { field: 'country', headerName: 'Country' , width: 100},
    { field: 'tags', headerName: 'Tags', width: 100},
    { field: 'listeners', headerName: 'Listeners', width: 100},
    { field: 'danceability', headerName: 'Danceability', width: 100},
    { field: 'duration_min', headerName: 'Length (min)', width: 100},
    { field: 'release_date', headerName: 'Release Date', width: 100},
    { field: 'critic_score', headerName: 'Critic Score', width: 100},
    { field: 'critic_reviews', headerName: 'Critic Reviews', width: 100},
    { field: 'user_score', headerName: 'User Score', width: 100},
    { field: 'user_reviews', headerName: 'User Reviews', width: 100},
  ]


  return (
    <Container>
      <h2>General Album Statistics</h2>
      <DataGrid
        rows={avgData}
        columns={avgColumns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
      <Divider />
      <h2>Find Albums from the Top 100 All-Time Artists!</h2>
      <DataGrid
        rows={topData}
        columns={topColumns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  )
}