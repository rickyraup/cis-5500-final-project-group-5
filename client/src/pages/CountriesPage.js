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

const findCountryStat = (statType, countryName, countries) => {
  var result = ''
  if (countryName === 'United States of America') {
    result = countries.filter(c => c.country === 'United States')
  } else {
    result = countries.filter(c => c.country === countryName)
  }
  if (result.length === 0) {
    return 0
  }
  if (statType === 0) {
    return result[0].numArtists
  }
  if (statType === 1) {
    return result[0].artist
  } 
  if (statType === 2) {
    return result[0].avgRating
  }
  return "INVALID statType"
}
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
                  if (statType === 0) {
                    setTooltipContent(`${geo.properties.name}: ${findCountryStat(statType, geo.properties.name, countryData)} artists`);
                  } else if (statType === 1) {
                    setTooltipContent(`${geo.properties.name}: ${findCountryStat(statType, geo.properties.name, countryData)}`)
                  } else {
                    setTooltipContent(`${geo.properties.name}: ${findCountryStat(statType, geo.properties.name, countryData)}`)
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
  const [countryData1, setCountryData1] = useState([])
  const [countryData2, setCountryData2] = useState([])
  const [countryData3, setCountryData3] = useState([]) 
  // 0 for numartists, 1 for topartist, 2 for avgalbumrating
  const [statType, setStatType] = useState(0)

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/numArtistsByCountry`)
    .then(res => res.json())
    .then(resJson => {
      console.log(resJson);
      setCountryData1(resJson);
    })


  }, [])

  useEffect(() => {

    fetch(`http://${config.server_host}:${config.server_port}/averageCountryRating`)
    .then(res => res.json())
    .then(resJson => setCountryData3(resJson))

  }, [])
  useEffect(() => {


    fetch(`http://${config.server_host}:${config.server_port}/topArtistByCountry`)
    .then(res => res.json())
    .then(resJson => {
      console.log(resJson);
      setCountryData2(resJson);
    })
  }, [])

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
      {statType === 0 && <CountryMap setTooltipContent={setContent} countryData={countryData1} statType={statType}/>}
      {statType === 1 && <CountryMap setTooltipContent={setContent} countryData={countryData2} statType={statType}/>}
      {statType === 2 && <CountryMap setTooltipContent={setContent} countryData={countryData3} statType={statType}/>}
      <Tooltip id='tt1'>{content}</Tooltip>
    </Container>
  )
}