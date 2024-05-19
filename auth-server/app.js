import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import * as database from './database.js';
import swagger from "./swagger.js";
import config  from "./config.js";
const { sign, verify } = jwt;

// Initialize Express app
const app = express();

// Define a JWT secret key. This should be isolated by using env variables for security
const jwtSecretKey = 'dsfdsfsdfdsvcsvdfgefg';

// Set up CORS and JSON middlewares
app.use(cors()); // Use cors middleware to enable CORS
swagger(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to authenticate requests
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token)
    return res.status(401).json({ message: "No token provided" });

  try
  {
    const tokenData = verify(token, jwtSecretKey);
    req.userId = tokenData.userId;
    next();
  }
  catch (e)
  {
    return res.status(401).json({ message: "Token expired or is not valid" });
  }
};

// Basic home route for the API
app.get('/', (_req, res) => {
  res.send('Hi!');
})

app.post('/login', (req, res) => {
  const user = database.findUserByEmail(req.body.email);
  if (!user || (user.password != req.body.password))
    return res.status(404).json({ message: "Error loging in" });

  const loginData = {
    userId: user.id,
    signInTime: Date.now(),
  }

  const token = sign(loginData, jwtSecretKey, { expiresIn: '60m' })
  return res.status(200).json({ token: token });
});

app.post('/register', (req, res) => {
  const user = database.findUserByEmail(req.body.email);
  if (user)
    return res.status(401).json({ status: 'invalid register', message: 'user already present' })

  const newUser = {
    id: Date.now(),
    email: req.body.email,
    password: req.body.password
  };
  database.addUser(newUser);
  res.status(201).json({ message: 'Registered' });
});

// The verify endpoint that checks if a given JWT token is valid
app.get('/verify', (req, res) => {
  const token = req.headers['authorization'];
  if (!token)
    return res.status(401).json({ message: "No token provided" });

  try
  {
    verify(token, jwtSecretKey);
    return res.status(200).json({ status: 'logged in', message: 'success' });
  }
  catch (e)
  {
    return res.status(401).json({ message: "Token expired or is not valid" });
  }
});

app.get('/workouts', authenticateToken, (req, res) => {
  res.status(200).json(database.getAllWorkouts(req.userId));
});

app.get('/workouts/:id', authenticateToken, (req, res) => {
  const workout = database.getWorkout(req.params.id);
  if (workout.userId != req.userId)
    return res.status(403).json({ message: "Access forbidden" });

  res.status(200).json(workout);
});

app.post('/workouts', authenticateToken, (req, res) => {
  var newWorkout = req.body;
  newWorkout.id = Math.floor(Math.random() * 99999) + 1;
  newWorkout.userId = req.userId;
  database.addWorkout(newWorkout);
  res.status(201).json({ message: 'Workout created' });
});

app.put('/workouts/:id', authenticateToken, (req, res) => {
  const workoutIdToUpdate = req.params.id;
  const oldWorkout = database.getWorkout(workoutIdToUpdate);
  if (!oldWorkout)
    return res.status(404).json({ message: "Workout with id not found" });

  if (oldWorkout.userId != req.userId)
    return res.status(403).json({ message: "Access forbidden" });

  var newWorkout = req.body;
  newWorkout.id = oldWorkout.id;
  newWorkout.userId = oldWorkout.userId;
  
  database.removeWorkout(workoutIdToUpdate);
  database.addWorkout(newWorkout);

  res.status(201).json({ message: 'Workout updated'});
});

app.delete('/workouts/:id', authenticateToken, (req, res) => {
  const workoutIdToDelete = req.params.id;
  const workout = database.getWorkout(workoutIdToDelete);
  if (!workout)
    return res.status(404).json({ message: "Workout with id not found" });

  if (workout.userId != req.userId)
    return res.status(403).json({ message: "Access forbidden" });

  database.removeWorkout(workoutIdToDelete);
  res.status(200).json({ message: 'Workout deleted' });
});

app.listen(config.port, () => {
  console.log("Server running on port " + config.port);
});