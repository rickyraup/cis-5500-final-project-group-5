import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
// CHANGE THEME COLORS
import { indigo, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

// ADD PAGE/COMPONENT IMPORTS HERE
import MainPage from './pages/MainPage'
import AlbumsPage from './pages/AlbumsPage'
import ArtistsPage from './pages/ArtistsPage'
import SearchPage from './pages/SearchPage'
import CountriesPage from './pages/CountriesPage'
import NavBar from './components/NavBar'

// CHANGE THEME COLORS AND OTHER CUSTOMIZATIONS
export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
  },
})

export default function App() {
  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<MainPage />}/>
        <Route path="/albums" element={<AlbumsPage />} />
        <Route path="/artists" element={<ArtistsPage />} />
        <Route path="/countries" element={<CountriesPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  )
}