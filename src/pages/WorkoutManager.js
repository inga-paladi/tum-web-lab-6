import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Box, Divider, Paper, Button, TextField, MenuItem, Select, FormControl, InputLabel, Checkbox } from "@mui/material";
import { styled } from '@mui/material/styles';
import Exercise1 from "./muscleUp.jpg";
import Exercise2 from "./pushUp.jpeg";
import Exercise3 from "./pullUps.png";

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

const exercisesList = [
  { id: 1, name: "Muscle Up", image: Exercise1 },
  { id: 2, name: "Push Up", image: Exercise2 },
  { id: 3, name: "Pull Ups", image: Exercise3 }
];

const ExerciseImage = styled('img')({
  width: 30,
  height: 30,
  borderRadius: '50%',
  marginRight: 5,
});

const WorkoutManager = ({ theme }) => {
  const [workouts, setWorkouts] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        setToken(token);
        loadWorkoutsFromAPI(token); // Load workouts after setting the token
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };
    fetchToken();
  }, []);

  const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const loadWorkoutsFromAPI = async (authToken) => {
    try {
      const response = await apiClient.get('/workouts', {
        headers: {
          'authorization': authToken
        }
      });
      setWorkouts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error('Workouts endpoint not found:', error);
      } else {
        console.error('Error loading workouts:', error);
      }
    }
  };

  const addWorkout = async () => {
    const newWorkout = {
      name: "New Workout",
      exercises: []
    };

    try {
      const response = await apiClient.post('/workouts', newWorkout, {
        headers: {
          'authorization': token
        }
      });
      if (response.status === 201)
        setWorkouts([...workouts, newWorkout]);
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  const removeWorkout = async (id) => {
    try {
      await apiClient.delete(`/workouts/${id}`, {
        headers: {
          'authorization': token
        }
      });
      setWorkouts(workouts.filter(workout => workout.id !== id));
    } catch (error) {
      console.error('Error removing workout:', error);
    }
  };

  const handleNameChange = async (id, newName) => {
    const updatedWorkout = workouts.find(workout => workout.id === id);
    updatedWorkout.name = newName;

    try {
      const response = await apiClient.put(`/workouts/${id}`, updatedWorkout, {
        headers: {
          'authorization': token
        }
      });
      setWorkouts(workouts.map(workout => workout.id === id ? response.data.workout : workout));
    } catch (error) {
      console.error('Error updating workout name:', error);
    }
  };

  const handleAddExercise = async (workoutId, exerciseId) => {
    const exerciseToAdd = exercisesList.find(exercise => exercise.id === exerciseId);
    const updatedWorkouts = workouts.map(workout => {
      if (workout.id === workoutId) {
        const updatedExercises = [...workout.exercises, { 
          ...exerciseToAdd,
          id: Date.now(), 
          sets: [{ numberOfSets: 0, previous: 0, weight: 0, reps: 0, completed: false }] 
        }];
        return { ...workout, exercises: updatedExercises, showAddButton: false };
      }
      return workout;
    });

    const updatedWorkout = updatedWorkouts.find(workout => workout.id === workoutId);

    try {
      await apiClient.put(`/workouts/${workoutId}`, updatedWorkout, {
        headers: {
          'authorization': token
        }
      });
      setWorkouts(updatedWorkouts);
    } catch (error) {
      console.error('Error adding exercise:', error);
    }
  };

  const removeExercise = async (workoutId, exerciseId) => {
    const updatedWorkouts = workouts.map(workout => {
      if (workout.id === workoutId) {
        const updatedExercises = workout.exercises.filter(exercise => exercise.id !== exerciseId);
        return { ...workout, exercises: updatedExercises };
      }
      return workout;
    });

    const updatedWorkout = updatedWorkouts.find(workout => workout.id === workoutId);

    try {
      await apiClient.put(`/workouts/${workoutId}`, updatedWorkout, {
        headers: {
          'authorization': token
        }
      });
      setWorkouts(updatedWorkouts);
    } catch (error) {
      console.error('Error removing exercise:', error);
    }
  };

  const handleSetChange = async (workoutId, exerciseId, setIndex, field, value) => {
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

    const updatedWorkout = updatedWorkouts.find(workout => workout.id === workoutId);

    try {
      await apiClient.put(`/workouts/${workoutId}`, updatedWorkout, {
        headers: {
          'authorization': token
        }
      });
      setWorkouts(updatedWorkouts);
    } catch (error) {
      console.error('Error updating set:', error);
    }
  };

  const handleCheckboxChange = async (workoutId, exerciseId, setIndex, checked) => {
    await handleSetChange(workoutId, exerciseId, setIndex, 'completed', checked);
  };

  const addSet = async (workoutId, exerciseId) => {
    const updatedWorkouts = workouts.map(workout => {
      if (workout.id === workoutId) {
        const updatedExercises = workout.exercises.map(exercise => {
          if (exercise.id === exerciseId) {
            const newSet = { numberOfSets: 0, previous: 0, weight: 0, reps: 0, completed: false };
            return { ...exercise, sets: [...exercise.sets, newSet] };
          }
          return exercise;
        });
        return { ...workout, exercises: updatedExercises };
      }
      return workout;
    });

    const updatedWorkout = updatedWorkouts.find(workout => workout.id === workoutId);

    try {
      await apiClient.put(`/workouts/${workoutId}`, updatedWorkout, {
        headers: {
          'authorization': token
        }
      });
      setWorkouts(updatedWorkouts);
    } catch (error) {
      console.error('Error adding set:', error);
    }
  };

  return (
    <Container>
      <Content>
        <p style={{ fontWeight: "bold", fontSize: 18 }}>Workouts</p>
        <Box display="flex" flexWrap="wrap" justifyContent="center" rowGap={20} columnGap={20}>
          {workouts.map(workout => (
            <WorkoutBox key={workout.id}>
              <TextField
                label="Workout Name"
                value={workout.name}
                style={{ marginBottom: 10, width: '100%' }}              />
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
                          label="weight"
                          value={set.weight}
                          onChange={(e) => handleSetChange(workout.id, exercise.id, index, 'weight', parseInt(e.target.value))}
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
                    value=""
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
    );
  };
  
  export default WorkoutManager;
  
