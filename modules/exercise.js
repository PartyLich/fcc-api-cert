/**
 * Apis and Microservices Projects - Exercise Tracker
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// user db schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  _id: {
    type: String,
    required: true,
  },
});
// user db model
const User = mongoose.model('User', userSchema);

// exercise schema
const exerciseSchema = new Schema({
  username: {
    // "jane9873",
    type: String,
    required: true,
  },
  description: {
    // "jogging",
    type: String,
    required: true,
  },
  duration: {
    // 15,
    type: Number,
    required: true,
  },
  _id: {
    // "Bk4ury1rH",
    type: String,
    required: true,
  },
  date: {
    // "Fri Jul 12 2019"
    type: Date,
    required: true,
  },
});
// exercise model
const Exercise = new mongoose.model('Exercise', exerciseSchema);

// connect to db
mongoose.connect(process.env.MONGO_URI);


/** a really poor error 'handler'. maximum airquotes
 * @param {Object} an error object
 */
const genericLogError = (callback) => (err) => {
  // handle database error
  console.error(err.toString());
  callback(err);
};

function errorHandler(err, req, res, next) {
  res
    .status(400)
    .send({error: err.message});
}


// POST /api/exercise/add
  // lookup user
    // res.status(400).json({error: 'unknown _id'});

// save exercise

// send response


// POST /api/exercise/new-user
  // validate input
    // res.status(400).json({error: 'Path `username` is required.'});
    // res.status(400).json({error: 'username already taken'});

  // add user

  // send response

// GET /api/exercise/log?{userId}[&from][&to][&limit]
// const getExercise