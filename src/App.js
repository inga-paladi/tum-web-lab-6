import { React, useState } from "react";
import './App.css';
import { Box } from "@mui/material";

function App() {
  return <Box
    display="flex"
    justifyContent="center"
  >
    <Box
      sx={{
        backgroundColor: "#F9FAFB",
        padding : "15px"
      }}
      width={500}
    >
      <p style={{ "font-weight": "bold" }}>
        Workouts
      </p>
      
      <Box
        sx={{
          backgroundColor: "white",
        }}
      >
        <p style = {{"font-size": "16px"}}>
          Afternoon workout
        </p> 
        <p style = {{"font-size": "10px"}}>
          Yesterday, 17:53
        </p>
      </Box>

    </Box> 
  </Box>
}

export default App;
