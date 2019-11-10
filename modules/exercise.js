/**
 * Apis and Microservices Projects - Exercise Tracker
 */
const mongoose = require('mongoose');

const {User} = require('../models/ExerciseUser');
const {Exercise} = require('../models/Exercise');

// connect to db
mongoose.connect(process.env.MONGO_URI);

const {genericLogError, errorHandler} = require('./errorHandler');


const idRadix = 36;
/**
 * Generate an id
 * @return {string} a new id string
 */
const generateId = () => Date.now().toString(idRadix);

/**
 * Get a user from the database and add them to the request object.
 * @param {string} paramLocation  request object property name
 * @param  {object}   req  request object
 * @param  {object}   res  response object
 * @param  {Function} next the next handler to execute
 */
const getUser = (paramLocation) => (req, res, next) => {
  const {userId} = req[paramLocation];

  User.findOne({userId}, (err, user) => {
    if (err) return next(err);

    console.log(`got user: ${JSON.stringify(user)}`);
    req.user = user;
    next();
  });
};

const getUserBody = getUser('body');
const getUserQuery = getUser('query');

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
 * @param {string} paramLocation  request object property name
 * @param  {object}   req  request object
 * @param  {object}   res  request object
 * @param  {Function} next next handler
 */
const lookupUser = (paramLocation) => (req, res, next) => {
  const {userId} = req[paramLocation];
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

const lookupUserBody = lookupUser('body');
const lookupUserQuery = lookupUser('query');

// save exercise
const {inputMissing} = require('../util/validation');
const {inputExists} = require('../util/validation');

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
  });
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
    _id: userId,
  };

  res.json(user);
};


// GET /api/exercise/log?{userId}[&from][&to][&limit]
/**
 * Validate input for GET exercise log
 * @param  {object}   req  request object
 * @param  {object}   res  request object
 * @param  {Function} next next handler
 */
const checkLogInput = (req, res, next) => {
  const {from, to, limit} = req.query;

  req.query.limit = parseInt(limit);

  next();
};

/**
 * Check if value is parseable to an integer.
 * @param  {string|number}  value value to check
 * @return {Boolean}       true if value is parseable to an integer,
 *    false otherwise
 */
const isInt = (value) => !isNaN(parseInt(value, 10));

/**
 * Get exercise log from database and add it to the request object.
 * @param  {object}   req  request object
 * @param  {object}   res  request object
 * @param  {Function} next next handler
 */
const getExerciseLog = (req, res, next) => {
  const {from, to, limit} = req.query;
  const {userId} = req.user;

  const query = Exercise.find({userId});

  query.select({
    _id: 0,
    userId: 1,
    description: 1,
    duration: 1,
    date: 1,
  });

  // Date filter
  if (inputExists(from)) query.where('date').gt(new Date(from));
  if (inputExists(to)) query.where('date').lt(new Date(to));

  // Result limit
  if (isInt(limit)) query.limit(limit);

  query.exec((err, docs) => {
    if (err) return next(err);

    console.log(`found exercise log: ${JSON.stringify(docs)}`);
    req.exerciseLog = docs;
    return next();
  });
};

/**
 * Send successful exercise log response
 * @param  {object}   req  request object
 * @param  {object}   res  request object
 * @param  {Function} next next handler
 */
const sendExerciseLogRes = (req, res) => {
  const {userId, username} = req.user;
  const {from, to} = req.query;
  const {exerciseLog: log} = req;
  const exerciseLog = {
    userId,
    username,
    count: log.length,
    log,
  };

  if (inputExists(from)) exerciseLog.from = from;
  if (inputExists(to)) exerciseLog.to = to;

  res.json(exerciseLog);
};


module.exports = {
  errorHandler,

  addExercise: [
    lookupUserBody,
    getUserBody,
    checkExerciseInput,
    saveExercise,
    addExerciseRes,
    errorHandler,
  ],

  newExerciseUser: [
    checkNewUserInput,
    saveUser,
    newUserRes,
    errorHandler,
  ],

  getLog: [
    lookupUserQuery,
    checkLogInput,
    getUserQuery,
    getExerciseLog,
    sendExerciseLogRes,
    errorHandler,
  ],
};
