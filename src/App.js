import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from "@mui/material";
import ResponsiveAppBar from "./ResponsiveAppBar";
import WorkoutManager from "./pages/WorkoutManager";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const pages = ['Home', 'Workouts'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function App() {
  const [theme, setTheme] = useState(lightTheme); // Default to light theme
  const [loggedIn, setLoggedIn] = useState(false); // State for user login status
  const [email, setEmail] = useState(""); // State for user email

  useEffect(() => {
    // Fetch the user email and token from local storage
    const user = JSON.parse(localStorage.getItem('user'))
  
    // If the token/email does not exist, mark the user as logged out
    if (!user || !user.token) {
      setLoggedIn(false)
      return
    }
  
    // If the token exists, verify it with the auth server to see if it is valid
    fetch('http://localhost:3080/verify', {
      method: 'POST',
      headers: {
        'jwt-token': user.token,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        setLoggedIn('success' === r.message)
        setEmail(user.email || '')
      })
  }, []);

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ResponsiveAppBar setTheme={setTheme} lightTheme={lightTheme} darkTheme={darkTheme} pages={pages} settings={settings} />
        <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
          {loggedIn ? ( // Render "Workouts" page only if user is logged in
            <Routes>
              <Route path="/" element={<WorkoutManager theme={theme} />} />
            </Routes>
          ) : (
            // Redirect to login page if user is not logged in
            <Routes>
              <Route path="/" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
            </Routes>
          )}
        </Box>
      </Router>
    </ThemeProvider>
  );
}


export default App;
