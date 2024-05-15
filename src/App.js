import React, { useState } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from "@mui/material";
import ResponsiveAppBar from "./ResponsiveAppBar";
import WorkoutManager from "./Components/WorkoutManager";

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

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  return (
    <ThemeProvider theme={theme}>
      <ResponsiveAppBar setTheme={setTheme} lightTheme={lightTheme} darkTheme={darkTheme} pages={pages} settings={settings} />
      <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        <WorkoutManager theme={theme} lightTheme={lightTheme} darkTheme={darkTheme} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
