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

const CountryMap = ({ setTooltipContent, countryData }) => {
  
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
                  setTooltipContent(`${geo.properties.name}: ${0} artists`);
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

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/numArtistsByCountry`)
      .then(res => res.json())
      .then(resJson => setCountryData(resJson))
  }, [])
  return (
    <Container>
      <CountryMap setTooltipContent={setContent} countryData={countryData}/>
      <Tooltip id='tt1'>{content}</Tooltip>
    </Container>
  )
}