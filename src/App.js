import React from "react";
import './App.css';
import Exercise1 from "./muscleUp.jpg";
import Exercise2 from "./pushUp.jpeg";
import Exercise3 from "./pullUps.png";
import { styled } from '@mui/material/styles';
import { Box, Divider, Grid, Paper } from "@mui/material";
import ResponsiveAppBar from "./ResponsiveAppBar";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function App() {
  return (
    <>
      <ResponsiveAppBar />
      <Box
        display="flex"
        justifyContent="center"
      >
        <Box
          sx={{
            backgroundColor: "#F9FAFB",
            padding: "15px"
          }}
          width={500}
        >
          <p style={{ "fontWeight": "bold" }}>
            Workouts
          </p>

          <Box
            sx={{
              backgroundColor: "white",
            }}
          >
            <p style={{ "fontSize": "16px" }}>
              Afternoon workout
            </p>
            <p style={{ "fontSize": "10px" }}>
              Yesterday, 17:53
            </p>
            <Divider />

            <p style={{ "fontSize": "16px" }}>
              Workout
            </p>

            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={1}>
                  <img src={Exercise1} style={{ width: '70%', height: '70%', borderRadius: '50%' }} alt="Logo" />
                </Grid>
                <Grid item xs={5}>
                  <p style={{ "fontSize": "18px" }}>
                    4 sets Muscle ups
                  </p>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={1}>
                  <img src={Exercise2} style={{ width: '70%', height: '70%', borderRadius: '50%' }} alt="Logo" />
                </Grid>
                <Grid item xs={5}>
                  <p style={{ "fontSize": "18px" }}>
                    3 sets Push ups
                  </p>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={1}>
                  <img src={Exercise3} style={{ width: '70%', height: '70%', borderRadius: '50%' }} alt="Logo" />
                </Grid>
                <Grid item xs={5}>
                  <p style={{ "fontSize": "18px" }}>
                    4 sets Pull ups
                  </p>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default App;
