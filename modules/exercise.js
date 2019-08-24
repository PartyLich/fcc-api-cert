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


const getUser = (req, res, next) => {
  const {userId} = req.body;

  User.findOne({_id: userId}, (err, user) => {
    if(err) return next(err);

    console.log(`got user: ${JSON.stringify(user)}`);
    req.user = user;
    next();
  });
};


const userExists = (query, success, fail) => {
  User.exists(query)
    .then(success)
    .catch(fail);
}

// POST /api/exercise/add
  // lookup user
const lookupUser = (req, res, next) => {
  const {userId} = req.body;
  const USER_NOT_FOUND = 'unknown _id';
  console.log(`finding user ${userId}`);

  User.exists({id: userId})
    .then((userExists) =>
      (userExists)
          ? next()
          : next(new Error(USER_NOT_FOUND))
    )
    .catch((err) =>
      genericLogError(err, next)
    );
};

// save exercise
const inputExists = (input) => input && input == '';
const inputMissing = (input) => !input || input == '';

const checkExerciseInput = (req, res, next) => {
  const NO_DURATION = 'Path `duration` is required.';
  const NO_DESCRIPTION = 'Path `description` is required.'
  const BAD_DATE = `Cast to Date failed for value "${date}" at path "date"`;
  const {duration, date, description} = req.body;

  if(inputMissing(duration)) return next(new Error(NO_DURATION));
  if(inputMissing(description)) return next(new Error(NO_DESCRIPTION));
  // fill in current date if not provided
  req.body.date = (inputMissing(date))
      ? new Date()
      : new Date(date);
  return (dateObj == 'Invalid Date')
      ? next(new Error(BAD_DATE))
      : next();
};

// send response


/** POST /api/exercise/new-user
 */
// validate input
const checkNewUserInput = (req, res, next) => {
  const NAME_MISSING = 'Path `username` is required.'
  const NAME_TAKEN = 'username already taken';
  const {username} = req.body;

  if(inputMissing(username)) return next(new Error(NAME_MISSING));

  userExists({username}
      , (exists) => (exists) ? next(new Error(NAME_TAKEN)) : next()
      , (err) => genericLogError(err, next));
};


  // add user

  // send response

// GET /api/exercise/log?{userId}[&from][&to][&limit]
// const getExercise


module.exports = {
  errorHandler,
  getUser,

  // add exercise
  lookupUser,
  checkExerciseInput,

  // new user
  checkNewUserInput,

};
