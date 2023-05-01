import { useEffect, useState } from 'react';
import { Divider, Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function ArtistsPage() {
  const [pageSize, setPageSize] = useState(10)
  const [avgData, setAvgData] = useState([])
  const [thresholdData, setThresholdData] = useState([])
  const [threshold, setThreshold] = useState(0)

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/averageRating`)
    .then(res => res.json())
    .then(resJson => setAvgData(resJson))
  }, [])

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/ratingThresholdCount?threshold=${threshold}`)
    .then(res => res.json())
    .then(resJson => setThresholdData(resJson))
  }, [threshold])

  const avgColumns = [
    // { field: 'Title', headerName: 'Title', width: 400, renderCell: (params) => (
    //     // <Link onClick={() => setSelectedSongId(params.row.artist)}>{params.value}</Link>
    // ) },
    { field: 'Artist', headerName: 'Artist', width: 400},
    { field: 'AvgRating', headerName: 'Average Rating' , width: 400},
  ]
  const thrColumns = [
    // { field: 'Title', headerName: 'Title', width: 400, renderCell: (params) => (
    //     // <Link onClick={() => setSelectedSongId(params.row.artist)}>{params.value}</Link>
    // ) },
    { field: 'Artist', headerName: 'Artist', width: 400},
    { field: 'Num_Ratings', headerName: 'Number of Ratings' , width: 400},
  ]


  return (
    <Container>
      <h2>Average Artist Ratings!</h2>
      <DataGrid
        rows={avgData}
        columns={avgColumns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
      <Divider />
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