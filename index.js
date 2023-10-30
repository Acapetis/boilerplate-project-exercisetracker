const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
mongoose.connect('mongodb+srv://pandin:dan615415@cluster0.0y33qs0.mongodb.net/fcc-mongodb-and-mongoose?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// let userSchema = new Schema({
//   username: String
// });


// let User = mongoose.model('User', userSchema);

// let exerciseSchema = new mongoose.Schema({
//   username: String,
//   description: String,
//   duration: Number,
//   date: String
//   // Add any other fields you need
// });
// let Exercise = mongoose.model('Exercise', exerciseSchema);





// let logSchema = new mongoose.Schema({
//   _id: {
//     type: mongoose.Schema.Types.ObjectId,
//     default: mongoose.Types.ObjectId,
//   },
//   username: String,
//   count: Number,
//   log: [exerciseSchema]
//   // Add any other fields you need
// });
// let Log = mongoose.model('Log', logSchema);




// // Create a new user
// app.post('/api/users', async (req, res) => {
//   const { username } = req.body;

//   // Create a new user document and save it to the database
//   try {
//     const newUser = new User({ username: username });
//     const savedUser = await newUser.save();

//     const newLog = new Log({ _id: newUser._id, username, count: 0, log: [] });
//     const savedLog = await newLog.save();
//     res.json(savedUser);
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ error: 'User creation failed' });
//   }
// });



// app.post('/api/users/:_id/exercises', async (req, res) => {
//   const { _id } = req.params;
//   const { description, duration, date } = req.body;
  
//   try {
//     // Find the user by _id
//     const user = await User.findById(_id);
//     //const userLog = await Log.findById(_id);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     const newExercise = new Exercise({ username: user.username, description, duration, date });
//     if (!date) {
//       newExercise.date = new Date().toDateString();
//     }
//     // Create a new exercise document and save it to the database
//     //create new exercise
    
//     const savedExercise = await newExercise.save();
  
    
   
//     // Add the exercise to the user's object (not the schema)
//     user.exercise = {
//       description: savedExercise.description,
//       duration: savedExercise.duration,
//       date: savedExercise.date
//     };
    
//     // Save the user's log
//     await user.save();
//     //user.save();
//     //console.log(user);
//     return res.json({user});
    
//     } catch (error) {
//       console.log(error);
//     }
// });   





// app.get('/api/users', async (req, res) => {
//   try {
//     // Query the database to retrieve all users
//     const allUsers = await User.find({}, 'username _id');

//     res.json(allUsers);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to retrieve users' });
//   }
// });

// app.get('/api/users/:_id/logs',async (req,res) => {
//   const { _id } = req.params;
//   const { from, to, limit } = req.query;
//   console.log(req.body);
//   console.log(req.query);
//   try {
//     // Find the user by _id
//     const log = await Log.findById(_id);
    
//     //const user = await User.findById(_id);
//     if (!log) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     // Convert from and to to Date objects if they exist
//     let fromDate = from ? new Date(from) : null;
//     let toDate = to ? new Date(to) : null;

//     // Filter log entries based on date range
//     let filteredLog = log.log;

//     if (fromDate) {
//       filteredLog = filteredLog.filter(entry => entry.date >= fromDate);
//     }

//     if (toDate) {
//       filteredLog = filteredLog.filter(entry => entry.date <= toDate);
//     }
    
//     // Limit the number of entries if a limit is provided
//     if (limit) {
//       const parsedLimit = parseInt(limit, 10);
//       if (!isNaN(parsedLimit)) {
//         filteredLog = filteredLog.slice(0, parsedLimit);
//       }
//     } else {
//       filteredLog = filteredLog.slice(0,);
//     }
    
//     res.json({log: filteredLog, count: filteredLog.length});
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to retrieve logs' });
//   }
// });    


// app.get('/api/clear', async (req, res) => {
//   try {
//     // Use the deleteMany method to remove all documents from the collection
//     const result = await User.deleteMany({});
//     const result2 = await Log.deleteMany({});
//     const result3 = await Exercise.deleteMany({});
//     if (result.deletedCount > 0) {
//       res.json({ message: 'All records deleted successfully' });
//     } else {
//       res.json({ message: 'No records found to delete' });
//     }
//   } catch (error) {
//     console.log("Error:", error);
//     res.status(500).json({ error: 'Failed to delete records' });
//   }
// });

// const listener = app.listen(process.env.PORT || 3000, () => {
//   console.log('Your app is listening on port ' + listener.address().port)
// })




let userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    }
  },
  { versionKey: false }
);

let User = mongoose.model("User", userSchema);

let exerciseSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    date: String,
    userId: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

let Exercise = mongoose.model("Exercise", exerciseSchema);


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", async (req, res) => {
  let username = req.body.username;
  let existingUser = await User.findOne({ username })

  if (username === ""){
    res.json({error: "username is required"})
  }

  if (existingUser){
    return res.json(existingUser)
  }

  let user = await User.create({
    username
  })

  res.json(user)
});

app.get("/api/users", async (req, res) => {
  let usersList = await User.find();
  res.json(usersList);
});


app.post("/api/users/:_id/exercises", async (req, res) => {
  let userId = req.params._id;
  let description = req.body.description;
  let duration = parseInt(req.body.duration);
  let date = new Date(req.body.date);

  if (date == "Invalid Date"){
    date = new Date().toDateString()
  } else {
    date = new Date(date).toDateString()
  }

  if (description === ""){
    return res.json({error: "description is required"})
  }

  if (duration === ""){
    return res.json({error: "duration is required"})
  } 

  let user = await User.findById(userId).select("username")

  if (!user){
    return res.json({error: "unknown userId"})
  } 

  let exercise = await Exercise.create({
    username: user.username,
    description, 
    duration, 
    date,
    userId,
  });

  return res.json({
    _id: user._id,
    username: user.username,
    date,
    duration,
    description,
  });
});


// app.get('/api/users/:_id/logs/:limit?/:from?/:to?', async function (req, res) {
// try {
//   res.setHeader("Access-Control-Allow-Origin", "*");

//   const userId = req.params._id;
//   const from = req.query?.from;
//   const to = req.query?.to;
//   const limit = Number(req.query?.limit) || 0;

//   let filterDate = {};
//   if (from) {
//     filterDate = { date: { $gte: from } }
//   }
//   if (to) {
//     if (from) {
//       filterDate = { date: { $gte: from, $lte: to } }
//     } else {
//       filterDate = { date: { $lte: to } }
//     }
//   }

//   console.log('get log query', req.query, filterDate, limit);

//   let user = await User.findById(userId);
//   if (!user) throw new Error("user not found")  

//   let exercise = await Exercise
//     .find({ 
//       $and: [{ user: user._id }, filterDate]
//     })
//     .sort({ date: 1 })
//     .limit(limit)      

//   if (!exercise) exercise = []

//   const log = {
//     username: user.username,
//     count: exercise.length,
//     _id: user._id,
//     log: exercise.map(val => {
//       return {
//         description: val.description,
//         duration: val.duration,
//         date: val.date.toDateString()
//       }
//     })
//   };

//   // console.log('get log user', user)
//   // console.log( 'get log exercise', exercise)
//   console.log('get log', log);

//   return res.json(log);
// } catch (e) {
//   console.log('ERROR GET LOGS', e.message);
//   return res.json({ error: e.message });
// }
// });

app.get("/api/users/:_id/logs", async (req, res) => {
  let userId = req.params._id;
  let user = await User.findById(userId).select("username")
  let count = await Exercise.countDocuments({userId})
  let log = await Exercise.find({userId})

  if (!user){
    return res.json({error: "unknown userId"})
  }

  if (req.query.from || req.query.to){
    let from = new Date(req.query.from);
    let to = new Date(req.query.to);
    let limit = parseInt(req.query.limit);
    //debug
    console.log(from , to ,limit);
    if (from == "Invalid Date"){
      from = new Date(0)
    } else {
      from = new Date(from)
    }

    if (to == "Invalid Date"){
      to = new Date()
    } else {
      to = new Date(to)
    }

    log = await Exercise.find({userId, date: {$gte: from, $lte: to}}).limit(limit)
    count = log.length
  } else if (req.query.limit){
    let limit = parseInt(req.query.limit);
    log = await Exercise.find({userId}).limit(limit)
    count = log.length
  }


  res.json({
    _id: user._id,
    username: user.username,
    count,
    log
  });
});
// app.get("/api/users/:_id/logs", (req, res, done) => {
//   getAllLogs(req.params._id, req.query.from || null, req.query.to || null, req.query.limit || null, (err, data) => {
//     if(err) return console.log(err);
//     console.log("The logs final: ", data);

//     res.json(data);

//     done(null, data);
//   })
// });

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});