import { useEffect, useState } from 'react';
import { Divider, Container, Slider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function ArtistsPage() {
  const [pageSize, setPageSize] = useState(10)
  const [avgData, setAvgData] = useState([])
  const [thresholdData, setThresholdData] = useState([])
  const [highData, setHighData] = useState([])
  const [threshold, setThreshold] = useState(0)

  //hooks for each component on artists page
  //hooks for rendering components that display avg. rating of each artist and best album for each artist
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/averageRating`)
    .then(res => res.json())
    .then(resJson => setAvgData(resJson))

    fetch(`http://${config.server_host}:${config.server_port}/highestRatedAlbumsPerArtist`)
    .then(res => res.json())
    .then(resJson => setHighData(resJson))
  }, [])

  //hook for rendering component that displays all artists at or above rating threshold
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/ratingThresholdCount?threshold=${threshold}`)
    .then(res => res.json())
    .then(resJson => setThresholdData(resJson))
  }, [threshold])

  //column definitions for each component
  //columns for artist avg. rating component
  const avgColumns = [
    { field: 'Artist', headerName: 'Artist', width: 400},
    { field: 'AvgRating', headerName: 'Average Rating' , width: 400},
  ]

  //columns for artists at/above threshold component
  const thrColumns = [
    { field: 'Artist', headerName: 'Artist', width: 400},
    { field: 'Num_Ratings', headerName: 'Number of Ratings Meeting Threshold' , width: 600},
  ]

  //columns for artist's highest rated album component
  const highColumns = [
    { field: 'artist', headerName: 'Artist', width: 400},
    { field: 'album', headerName: 'Album' , width: 400},
    { field: 'avg_dance', headerName: 'Average Danceability', width: 400},
    { field: 'avg_rating', headerName: 'Average Rating' , width: 400},
    { field: 'Metacritic_User_Score', headerName: 'Metacritic User Score' , width: 400},
  ]


  return (
    <Container>

      {/*Render first component (avg. artist ratings) on page*/}
      <h2>Average Artist Ratings!</h2>
      <DataGrid
        getRowId={(row) => row.Artist}
        rows={avgData}
        columns={avgColumns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
      <Divider />

      {/*Render second component (artists' best albums) on page*/}
      <h2>What is Each Artist's Best Album?</h2>
      <DataGrid
        getRowId={(row) => row.artist}
        rows={highData}
        columns={highColumns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
      <Divider />

      {/*Render third component (artists at/above rating threshold) on page*/}
      <h2>Does Your Artist Meet the Rating Threshold?</h2>
      <div>{`Current Threshold: ${threshold}`}</div>
      <Slider
          value={threshold}
          min={0}
          max={100}
          step={0.025}
          onChange={(e, newValue) => setThreshold(newValue)}
          valueLabelDisplay='auto'
        />
      <DataGrid
        getRowId={(row) => row.Artist}
        rows={thresholdData}
        columns={thrColumns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  )
}