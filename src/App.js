import React, { useState } from "react";
import './App.css';
import Exercise1 from "./muscleUp.jpg";
import Exercise2 from "./pushUp.jpeg";
import Exercise3 from "./pullUps.png";
import { styled } from '@mui/material/styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { Box, Divider, Paper, Button, TextField, MenuItem, Select, FormControl, InputLabel, Checkbox } from "@mui/material";
import ResponsiveAppBar from "./ResponsiveAppBar";
export {lightTheme, darkTheme};

const pages = ['Home', 'Workouts'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

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

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
}));

const Content = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  width: '90%',
  maxWidth: 800,
}));

const WorkoutBox = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#f9fafa',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[1],
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  textAlign: 'center',
}));

const ExerciseImage = styled('img')({
  width: 30,
  height: 30,
  borderRadius: '50%',
  marginRight: 5,
});

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [theme, setTheme] = useState(lightTheme); // Default to light theme
  
  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  const addWorkout = () => {
    const newWorkout = {
      id: Date.now(),
      name: "New Workout",
      exercises: [],
      showAddButton: true,
      showExercisesList: false
    };
    setWorkouts([...workouts, newWorkout]);
  };

  const removeWorkout = (id) => {
    const updatedWorkouts = workouts.filter(workout => workout.id !== id);
    setWorkouts(updatedWorkouts);
  };

  const handleNameChange = (id, newName) => {
    const updatedWorkouts = workouts.map(workout => {
      if (workout.id === id) {
        return { ...workout, name: newName };
      }
      return workout;
    });
    setWorkouts(updatedWorkouts);
  };

  const handleAddExercise = (workoutId, exerciseId) => {
    const exerciseToAdd = exercisesList.find(exercise => exercise.id === exerciseId);
    const updatedWorkouts = workouts.map(workout => {
      if (workout.id === workoutId) {
        const updatedExercises = [...workout.exercises, { 
          ...exerciseToAdd,
          id: Date.now(), 
          sets: [{ numberOfSets: 0, previous: 0, kg: 0, reps: 0, completed: false }] 
        }];
        return { ...workout, exercises: updatedExercises, showAddButton: false };
      }
      return workout;
    });
    setWorkouts(updatedWorkouts);
  };

  const removeExercise = (workoutId, exerciseId) => {
    const updatedWorkouts = workouts.map(workout => {
      if (workout.id === workoutId) {
        const updatedExercises = workout.exercises.filter(exercise => exercise.id !== exerciseId);
        return { ...workout, exercises: updatedExercises };
      }
      return workout;
    });
    setWorkouts(updatedWorkouts);
  };
  

  const handleSetChange = (workoutId, exerciseId, setIndex, field, value) => {
    const updatedWorkouts = workouts.map(workout => {
      if (workout.id === workoutId) {
        const updatedExercises = workout.exercises.map(exercise => {
          if (exercise.id === exerciseId) {
            const updatedSets = exercise.sets.map((set, index) => {
              if (index === setIndex) {
                return { ...set, [field]: value };
              }
              return set;
            });
            return { ...exercise, sets: updatedSets };
          }
          return exercise;
        });
        return { ...workout, exercises: updatedExercises };
      }
      return workout;
    });
    setWorkouts(updatedWorkouts);
  };

  const handleCheckboxChange = (workoutId, exerciseId, setIndex, checked) => {
    const updatedWorkouts = workouts.map(workout => {
      if (workout.id === workoutId) {
        const updatedExercises = workout.exercises.map(exercise => {
          if (exercise.id === exerciseId) {
            const updatedSets = exercise.sets.map((set, index) => {
              if (index === setIndex) {
                return { ...set, completed: checked };
              }
              return set;
            });
            return { ...exercise, sets: updatedSets };
          }
          return exercise;
        });
        return { ...workout, exercises: updatedExercises };
      }
      return workout;
    });
    setWorkouts(updatedWorkouts);
  };

  const addSet = (workoutId, exerciseId) => {
    const updatedWorkouts = workouts.map(workout => {
      if (workout.id === workoutId) {
        const updatedExercises = workout.exercises.map(exercise => {
          if (exercise.id === exerciseId) {
            const newSet = { numberOfSets: 0, previous: 0, kg: 0, reps: 0, completed: false };
            return { ...exercise, sets: [...exercise.sets, newSet] };
          }
          return exercise;
        });
        return { ...workout, exercises: updatedExercises };
      }
      return workout;
    });
    setWorkouts(updatedWorkouts);
  };

  const exercisesList = [
    { id: 1, name: "Muscle Up", image: Exercise1 },
    { id: 2, name: "Push Up", image: Exercise2 },
    { id: 3, name: "Pull Ups", image: Exercise3 }
  ];

  return (
    <ThemeProvider theme = {theme}>
      <ResponsiveAppBar setTheme={setTheme} lightTheme={lightTheme} darkTheme={darkTheme} pages={pages} settings={settings} />

      <Container  sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        <Content>
          <p style={{ fontWeight: "bold", fontSize: 18 }}>Workouts</p>

          <Box display="flex" flexWrap="wrap" justifyContent="center" rowGap={20} columnGap={20}>
            {workouts.map(workout => (
              <WorkoutBox key={workout.id}>
                <TextField
                  label="Workout Name"
                  value={workout.name}
                  onChange={(e) => handleNameChange(workout.id, e.target.value)}
                  style={{ marginBottom: 10, width: '100%' }}
                />
                <Divider />

                {workout.exercises.map(exercise => (
                  <div key={exercise.id} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                      <ExerciseImage src={exercise.image} alt={exercise.name} />
                      <p>{exercise.name}</p>
                    </div>
                    {exercise.sets.map((set, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', marginTop: 5 }}>
                        <p>{`Set ${index + 1}: `}</p>
                        
                        <TextField
                          type="number"
                          label="Kg"
                          value={set.kg}
                          onChange={(e) => handleSetChange(workout.id, exercise.id, index, 'kg', parseInt(e.target.value))}
                          style={{ marginRight: 10, width: 70 }}
                        />
                        <TextField
                          type="number"
                          label="Reps"
                          value={set.reps}
                          onChange={(e) => handleSetChange(workout.id, exercise.id, index, 'reps', parseInt(e.target.value))}
                          style={{ marginRight: 10, width: 70 }}
                        />
                        <Checkbox
                          checked={set.completed}
                          onChange={(e) => handleCheckboxChange(workout.id, exercise.id, index, e.target.checked)}
                        />
                        <Button onClick={() => removeExercise(workout.id, exercise.id)} size="small">Remove</Button>
                      </div>
                    ))}
                    <Button onClick={() => addSet(workout.id, exercise.id)} size="small">Add Set</Button>
                  </div>
                ))}

                <FormControl style={{ marginTop: 10, width: '100%' }}>
                  <InputLabel id="exercise-select-label">Select Exercise</InputLabel>
                  <Select
                    labelId="exercise-select-label"
                    id="exercise-select"
                    value={0}
                    onChange={(e) => handleAddExercise(workout.id, e.target.value)}
                    style={{ width: '100%' }}
                  >
                    {exercisesList.map(exercise => (
                      <MenuItem key={exercise.id} value={exercise.id}>
                        <ExerciseImage src={exercise.image} alt={exercise.name} />
                        {exercise.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button onClick={() => removeWorkout(workout.id)} size="small">Remove Workout</Button>
              </WorkoutBox>
            ))}
          </Box>

          <Button onClick={addWorkout} variant="contained" color="primary" style={{ marginBottom: 20 }}>
            Add Workout
          </Button>

        </Content>
      </Container>
    </ThemeProvider>
  );
}

export default App;
