import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'

// Set up the database adapter
const db = new LowSync(new JSONFileSync("database.json"), { users: [], workouts: [] });
db.read();

// Function to add a user
function addUser(user) {
  db.data.users.push(user);
  db.write();
}

// Function to get all users
function getUsers() {
  return db.data.users;
}

// Function to find a user by email
function findUserByEmail(email) {
  return db.data.users.find((user) => user.email === email);
}

function getAllWorkouts(userId) {
  return db.data.workouts.filter((workout) => workout.userId == userId);
}

function getWorkout(workoutId) {
  return db.data.workouts.find((workout) => (workout.id == workoutId));
}

function addWorkout(workout) {
  db.data.workouts.push(workout);
  db.write();
}

function removeWorkout(workoutId) {
  db.data.workouts = db.data.workouts.filter((workout) => workout.id != workoutId);
  db.write();
}

export {
  addUser,
  getUsers,
  findUserByEmail,
  getAllWorkouts,
  getWorkout,
  addWorkout,
  removeWorkout,
};