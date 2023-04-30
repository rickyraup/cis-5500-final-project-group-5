import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
// CHANGE THEME COLORS
import { indigo, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

// ADD PAGE/COMPONENT IMPORTS HERE
import MainPage from './pages/MainPage'
import ArtistsPage from './pages/ArtistsPage'
import AlbumsPage from './pages/AlbumsPage'
import SongsPage from './pages/SongsPage'
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
        {/* ADD PAGE ROUTES HERE */}
        <Route path="/artists" element={<ArtistsPage />} />
        <Route path="/albums" element={<AlbumsPage />} />
        <Route path="/songs" element={<SongsPage />} />
        <Route path="/countries" element={<CountriesPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  )
}