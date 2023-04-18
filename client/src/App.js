import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
// CHANGE THEME COLORS
import { indigo, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

// ADD PAGE/COMPONENT IMPORTS HERE
import MainPage from './pages/MainPage'

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
            {/* <NavBar /> */}
            <Routes>
                <Route path="/" element={<MainPage />}/>
                {/* ADD PAGE ROUTES HERE */}
            </Routes>
        </BrowserRouter>
        </ThemeProvider>
    )
}