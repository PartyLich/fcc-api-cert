/**
 * API Project: File Metadata Microservice
 * /api/fileanalyse
 *
 * I can submit a form object that includes a file upload.
 * The from file input field has the "name" attribute set to "upfile". We rely
 *  on this in testing.
 * When I submit something, I will receive the file name, and size in bytes
 * within the JSON response.
 */
const {errorHandler} = require('./errorHandler');
const {inputMissing} = require('../util/validation');


module.exports = {
  fileAnalyse: [
    analyseFile,
    respond,
    errorHandler,
  ],
};


/**
 * Format express-fileupload {file}
 * @param {object} file file parsed by express-fileupload
 * @param  {string} file.name  file name
 * @param  {number} file.size  file size in bytes
 * @param  {string} file.mimetype  mimetype of the file
 * @return {object}  formatted object
 */
const formatMetadata = ({name, size, mimetype: type}) => ({
  name,
  type,
  size,
});

/**
 * Send file metadata response to client
 * @param  {object} req request object
 * @param  {object} res response object
 * @param {function} next next handler to execute
 */
function analyseFile(req, res, next) {
  if (inputMissing(req.files)) return next(new Error('No file received.'));
  const file = req.files.upfile;


  req.fileMetadata = formatMetadata(file);
  next();
}

/**
 * Send file metadata response to client
 * @param  {object} req request object
 * @param  {response} res response object
 */
function respond(req, res) {
  const metadata = req.fileMetadata;

  res.json(metadata);
}
