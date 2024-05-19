import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from "@mui/material";
import ResponsiveAppBar from "./ResponsiveAppBar.js";
import WorkoutManager from "./pages/WorkoutManager.js";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home.js";
import Login from "./pages/login.js";

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
  const [theme, setTheme] = useState(lightTheme);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (!user || !user.token) {
      // If there's no user data or token, set logged in to false and return
      setLoggedIn(false);
      return;
    }
  
    fetch('http://localhost:3000/verify', {
      method: 'POST',
      headers: {
        'authorization': user.token,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.status === 'logged in') {
          // If the token is still valid, set logged in to true
          setLoggedIn(true);
          setEmail(user.email || '');
        } else {
          // If the token is expired or invalid, clear user data and set logged in to false
          localStorage.removeItem('user');
          setLoggedIn(false);
        }
      })
      .catch((error) => {
        // Handle fetch errors, e.g., network issues
        console.error('Error verifying token:', error);
        // Assume not logged in on fetch error
        setLoggedIn(false);
      });
  }, []);
  

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  // Conditionally render the login page if user is not logged in
  if (!loggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <Router>
          <ResponsiveAppBar setTheme={setTheme} lightTheme={lightTheme} darkTheme={darkTheme} pages={pages} settings={settings} />
          <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
            <Routes>
              <Route path="/" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
            </Routes>
          </Box>
        </Router>
      </ThemeProvider>
    );
  }

  // Render the workout manager page if user is logged in
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ResponsiveAppBar setTheme={setTheme} lightTheme={lightTheme} darkTheme={darkTheme} pages={pages} settings={settings} />
        <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<WorkoutManager theme={theme} />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}


export default App;
