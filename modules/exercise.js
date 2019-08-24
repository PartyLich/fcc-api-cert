/**
 * Apis and Microservices Projects - Exercise Tracker
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// counter db schema
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
// counter db model
const User = mongoose.model('User', userSchema);


mongoose.connect(process.env.MONGO_URI);


/** a really poor error 'handler'. maximum airquotes
 * @param {Object} an error object
 */
const genericLogError = (callback) => (err) => {
      // handle database error
      console.error(err.toString());
      callback(err);
  };

function errorHandler (err, req, res, next) {
  res
    .status(400)
    .send({ error: err });
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