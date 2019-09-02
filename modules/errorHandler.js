module.exports = {
  genericLogError,
  errorHandler,
};


/** Log error before continuing to {callback}
 * @param {function} callback a callback function to execute
 * @param {Object} an error object
 */
function genericLogError(callback) {
  return (err) => {
    console.error(err.toString());
    callback(err);
  };
}

/**
 * Send JSON error response to client
 * @param  {object}   err  an Error object
 * @param  {object}   req  request object
 * @param  {object}   res  response object
 * @param  {Function} next next handler to execute
 */
function errorHandler(err, req, res, next) {
  res
    .status(400)
    .send({error: err.message});
}
