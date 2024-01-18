const express = require('express')
const app = express()
const cors = require('cors')
const { v4: uuidv4 } = require('uuid'); // Importing uuid to generate unique ids
const mongoose = require('mongoose')


require('dotenv').config()

mongoose.connect("mongodb+srv://pandin:1234@cluster0.0y33qs0.mongodb.net/?retryWrites=true&w=majority")
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a user schema
const userSchema = new mongoose.Schema({
  username: String,
});
const exerciseSchema = new mongoose.Schema({
  username: String,
  description: String,
  duration: Number,
  date: { type: Date, default: Date.now },
});
const logSchema = new mongoose.Schema({
  username: String,
  count: Number,
  _id: String,
  log: []
});

// Create a user model
const User = mongoose.model('exercizeUser', userSchema);
const Exercise = mongoose.model('exercizeDescription', exerciseSchema);
const Log = mongoose.model('exerciseLog', logSchema);

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true })); // Middleware to parse form data
app.use(express.json()); // Middleware to parse JSON data
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users',async (req,res) => {
  const { username } = req.body;
  try {
    // Create a new user in the database
    const newUser = await User.create({ username });
    const newLog = await Log.create({ username: username ,count: 0,_id: newUser._id,log: []});
    // Send the response with the user's details
    res.json({ username: newUser.username, _id: newUser._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get('/api/users', async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await User.find({}, { _id: 1, username: 1 });

    // Send the response with the list of users
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/users/:_id/exercises', async (req,res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  try {
    const user = await User.findById(_id);
    const log = await Log.findById(_id);
    const userName = user.username;
    console.log(log.username)
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newExercise = await Exercise.create({
      userName,
      description,
      duration,
      date: date ? new Date(date) : new Date()
    });

    // Add the exercise to the user's exercises array
    log.log = log.log || [];
    log.log.push(newExercise);
    log.save();
    log.count = log.log.length;
    log.save();
    
    res.json({
      username: user.username,
      log: log.log,
      _id: user._id,
      date: newExercise.date.toDateString(),
      duration: newExercise.duration,
      description: newExercise.description,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
    
  
  
})

app.get('/api/users/:_id/logs', async (req, res) => {
  const { _id } = req.params;
  console.log(_id)
  try {
    // Find the user by ID
    const log = await Log.findById(_id);

    if (!log) {
      return res.status(404).json({ error: 'User not found' });
    }

    
    // Respond with the user object, the count of exercises, and the exercise log
    res.json({
      username: log.username,
      count: log.count,
      _id: log._id,
      log: log.log,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
