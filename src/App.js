import React, { useState } from "react";
import './App.css';
import Exercise1 from "./muscleUp.jpg";
import Exercise2 from "./pushUp.jpeg";
import Exercise3 from "./pullUps.png";
import { styled } from '@mui/material/styles';
import { Box, Divider, Grid, Paper, Button, TextField, MenuItem, Select, FormControl, InputLabel, Checkbox } from "@mui/material";
import ResponsiveAppBar from "./ResponsiveAppBar";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const exercisesList = [
  { id: 1, name: "Exercise 1", image: Exercise1 },
  { id: 2, name: "Exercise 2", image: Exercise2 },
  { id: 3, name: "Exercise 3", image: Exercise3 }
];

function App() {
  const [workouts, setWorkouts] = useState([]);

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
          id: Date.now(), // Generate a unique ID for the exercise
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
          width={800}
        >
          <p style={{ fontWeight: "bold" }}>Workouts</p>

          {workouts.map(workout => (
            <div key={workout.id} className="workout-box">
              <TextField
                label="Workout Name"
                value={workout.name}
                onChange={(e) => handleNameChange(workout.id, e.target.value)}
              />
              <Divider />

              {workout.exercises.map(exercise => (
                <div key ={exercise.id} >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={exercise.image} alt={exercise.name} style={{ width: '50px', marginRight: '10px' }} />
                    <p>{exercise.name}</p>
                  </div>
                    {exercise.sets.map((set, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                        <p>{`Set ${index + 1}: `}</p>
                        <TextField
                          type="number"
                          label="Previous (kg * reps)"
                          value={set.previous}
                          onChange={(e) => handleSetChange(workout.id, exercise.id, index, 'previous', parseInt(e.target.value))}
                          style={{ marginRight: '10px', width: '100px' }}
                        />
                        <TextField
                          type="number"
                          label="Kg"
                          value={set.kg}
                          onChange={(e) => handleSetChange(workout.id, exercise.id, index, 'kg', parseInt(e.target.value))}
                          style={{ marginRight: '10px', width: '50px' }}
                        />
                        <TextField
                          type="number"
                          label="Reps"
                          value={set.reps}
                          onChange={(e) => handleSetChange(workout.id, exercise.id, index, 'reps', parseInt(e.target.value))}
                          style={{ marginRight: '10px', width: '50px' }}
                        />
                        <Checkbox
                          checked={set.completed}
                          onChange={(e) => handleCheckboxChange(workout.id, exercise.id, index, e.target.checked)}
                        />
                        <Button onClick={() => removeExercise(workout.id, exercise.id)}>Remove</Button>
                        <hr />
                      </div>
                    ))}
                    <Button onClick={() => addSet(workout.id, exercise.id)}>Add Set</Button>
                    <hr />  
              </div>
            ))}

            <FormControl>
              <InputLabel id="exercise-select-label">Select Exercise</InputLabel>
              <Select
                labelId="exercise-select-label"
                id="exercise-select"
                value={0}
                onChange={(e) => handleAddExercise(workout.id, e.target.value)}
              >
                {exercisesList.map(exercise => (
                  <MenuItem key={exercise.id} value={exercise.id}>
                    <img src={exercise.image} alt={exercise.name} style={{ width: '20px', marginRight: '10px' }} />
                    {exercise.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button onClick={() => removeWorkout(workout.id)}>Remove Workout</Button>
          </div>
        ))}

        <Button onClick={addWorkout}>Add Workout</Button>

      </Box>
    </Box>
  </>
);
}

export default App;