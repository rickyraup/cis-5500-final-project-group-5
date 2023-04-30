import { useEffect, useState } from 'react';
import { Button, Switch, Checkbox, Container, FormControl, FormControlLabel, Grid, Link, Slider, TextField, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid, heIL } from '@mui/x-data-grid';
import { formatDuration } from '../helpers/formatter';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

const config = require('../config.json')
const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

const CountryMap = ({ setTooltipContent, countryData, statType }) => {
  
  return (
    <ComposableMap data-tip="">
      <ZoomableGroup>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                data-tooltip-id='tt1'
                onMouseEnter={() => {
                  // NEED TO FIGURE OUT FORMAT OF countryData
                  if (statType === 0) {
                    setTooltipContent(`${geo.properties.name}: ${'{number of artists}'} artists`);
                  } else if (statType === 1) {
                    setTooltipContent(`${geo.properties.name}: ${'{name of top artist}'}`)
                  } else {
                    setTooltipContent(`${geo.properties.name}: ${'{average album rating}'}`)
                  }
                }}
                onMouseLeave={() => {
                  setTooltipContent('');
                }}
                style={{
                  default: {
                    fill: "#D6D6DA",
                    stroke: '#FFFFFF',
                    strokeWidth: 0.75,
                    outline: 'none'
                  },
                  hover: {
                    fill: "indigo",
                    outline: 'none'
                  }
                }}
              />
            ))
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  )
}

export default function CountriesPage() {
  const [content, setContent] = useState("")
  const [countryData, setCountryData] = useState([]) 
  // 0 for numartists, 1 for topartist, 2 for avgalbumrating
  const [statType, setStatType] = useState(0)

  useEffect(() => {
    if (statType === 0) {
      fetch(`http://${config.server_host}:${config.server_port}/numArtistsByCountry`)
      .then(res => res.json())
      .then(resJson => setCountryData(resJson))
    } else if (statType === 1) {
      fetch(`http://${config.server_host}:${config.server_port}/topArtistByCountry`)
      .then(res => res.json())
      .then(resJson => setCountryData(resJson))
    } else {
      fetch(`http://${config.server_host}:${config.server_port}/averageCountryRating`)
      .then(res => res.json())
      .then(resJson => setCountryData(resJson))
    }
  }, [statType])
  return (
    <Container>
      <br />
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <FormControl>
            <InputLabel id="stat-type-label">Statistics</InputLabel>
            <Select
              labelId='stat-type-label'
              id='stat-type-select'
              value={statType}
              label='Statistics'
              onChange={e => setStatType(e.target.value)}
            >
              <MenuItem value={0}>Number of Artists</MenuItem>
              <MenuItem value={1}>Top Artist</MenuItem>
              <MenuItem value={2}>Average Album Rating</MenuItem>              
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <CountryMap setTooltipContent={setContent} countryData={countryData} statType={statType}/>
      <Tooltip id='tt1'>{content}</Tooltip>
    </Container>
  )
}