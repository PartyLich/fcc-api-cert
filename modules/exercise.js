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
    unique: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
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
  userId: {
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

const idRadix = 36;
/**
 * Generate an id
 * @return {string} a new id string
 */
const generateId = () => Date.now().toString(idRadix);

/**
 * Get a user from the database and add them to the request object.
 * @param  {object}   req  request object
 * @param  {object}   res  response object
 * @param  {Function} next the next handler to execute
 */
const getUser = (req, res, next) => {
  const {userId} = req.body;

  User.findOne({userId}, (err, user) => {
    if (err) return next(err);

    console.log(`got user: ${JSON.stringify(user)}`);
    req.user = user;
    next();
  });
};


/**
 * Check if a user exists and execute a success or failure callback.
 * Success will pass a boolean value; true if the query target exists,
 * false otherwise.
 * @param  {object} query   a valid mongo query object
 * @param  {function} success callback to execute if the database check succeeds
 * @param  {function} fail    error callback
 */
const userExists = (query, success, fail) => {
  User.exists(query)
      .then(success)
      .catch(fail);
};

// POST /api/exercise/add
/**
 * Check for user existence in the database.
 * @param  {object}   req  request object
 * @param  {object}   res  request object
 * @param  {Function} next next handler
 */
const lookupUser = (req, res, next) => {
  const {userId} = req.body;
  const USER_NOT_FOUND = 'unknown userId';
  console.log(`finding user ${userId}`);

  User.exists({userId})
    .then((userExists) =>
      (userExists)
          ? next()
          : next(new Error(USER_NOT_FOUND))
    )
    .catch((err) => {
      genericLogError(err, next);
      next(err);
    });
};

// save exercise
const inputExists = (input) => input && input == '';
const inputMissing = (input) => !input || input == '';

/**
 * Validate new exercise inputs. User id is checked earlier in the route.
 * @param  {object}   req  request object
 * @param  {object}   res  request object
 * @param  {Function} next next handler
 */
const checkExerciseInput = (req, res, next) => {
  const {duration, date, description} = req.body;
  const NO_DURATION = 'Path `duration` is required.';
  const NO_DESCRIPTION = 'Path `description` is required.';
  const BAD_DATE = `Cast to Date failed for value "${date}" at path "date"`;

  if (inputMissing(duration)) return next(new Error(NO_DURATION));
  if (inputMissing(description)) return next(new Error(NO_DESCRIPTION));

  // fill in current date if not provided
  req.body.date = (inputMissing(date))
      ? new Date()
      : new Date(date);
  return (req.body.date == 'Invalid Date')
      ? next(new Error(BAD_DATE))
      : next();
};


/**
 * Save new exercise to database
 * @param  {object}   req  request object
 * @param  {object}   res  request object
 * @param  {Function} next next handler
 */
const saveExercise = (req, res, next) => {
  const {userId, duration, date, description} = req.body;
  const newExercise = new Exercise({
    userId,
    duration,
    date,
    description,
  });

  newExercise.save((err, data) => {
    return (err)
      ? next(err)
      : next();
  })
};


/**
 * Send add exercise response
 * @param  {object}   req  request object
 * @param  {object}   res  request object
 * @param  {Function} next next handler
 */
const addExerciseRes = (req, res) => {
  const {duration, date, description} = req.body;
  const {username, userId} = req.user;
  const success = {
    username,
    userId,
    description,
    duration,
    date: date.toDateString(),
  };

  res.json(success);
};


/** POST /api/exercise/new-user
 */
/**
 * Validate new user input
 * @param  {object}   req  request object
 * @param  {object}   res  request object
 * @param  {Function} next next handler
 */
const checkNewUserInput = (req, res, next) => {
  const NAME_MISSING = 'Path `username` is required.';
  const NAME_TAKEN = 'username already taken';
  const {username} = req.body;

  if (inputMissing(username)) return next(new Error(NAME_MISSING));

  userExists(
      {username},
      (exists) => (exists ? next(new Error(NAME_TAKEN)) : next()),
      (err) => genericLogError(err, next)
  );
};


/**
 * Create a new user and save them to the database.
 * @param  {object}   req  request object
 * @param  {object}   res  request object
 * @param  {Function} next next handler
 */
const saveUser = (req, res, next) => {
  const {username} = req.body;
  const userId = generateId();
  const newUser = new User({
    username,
    userId,
  });

  req.userId = userId;

  newUser.save((err, data) => {
    return (err)
      ? next(err)
      : next();
  });
};


/**
 * Send new user success response
 * @param  {object} req request object
 * @param  {response} res response object
 */
const newUserRes = (req, res) => {
  const {username} = req.body;
  const userId = req.userId;
  const user = {
    userId,
    username,
  };

  res.json(user);
};


// GET /api/exercise/log?{userId}[&from][&to][&limit]
// const getExercise


module.exports = {
  errorHandler,
  getUser,

  // add exercise
  lookupUser,
  checkExerciseInput,
  saveExercise,
  addExerciseRes,

  // new user
  checkNewUserInput,
  saveUser,
  newUserRes,

};
