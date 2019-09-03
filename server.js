// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();


// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
const cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// body parser middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint...
app.get('/api/hello', function (req, res) {
  res.json({greeting: 'hello API'});
});

/** Timestamp microservice
 * /api/timestamp/:date_string?
 */
const { timestamp } = require('./modules/timeStamp');

app.route('/api/timestamp/:date_string?')
  .get(timestamp);

/** Whoami microservice
 * [base url]/api/whoami
 */
const {whoami} = require('./modules/whoami');

app
  .route('/api/whoami')
  .get(whoami);


/** url shortener microservice
 * /api/shorturl/new
 */
const shortUrl = require('./modules/urlShortener');
const { newShortUrl } = shortUrl;
const { getShortUrl } = shortUrl;

app
  .route('/api/shorturl/new')
  .post(
      newShortUrl
   )
  .get((req, res) => res.sendFile(__dirname + '/views/urlShortener.html'));

app
  .route('/api/shorturl/:url_id')
  .get(
      getShortUrl
  );

/** counter for link shortener
 */
const { sendNextId } = require('./modules/idService');

app
  .route('/priv/idService/new')
  .get(
    sendNextId
  );


/** Exercise Tracker
 */
const Exercise = require('./modules/exercise');

// POST /api/exercise/add
const { addExercise } = Exercise;

app
  .route('/api/exercise/add')
  .post(
    addExercise
  );

// POST /api/exercise/new-user
const { newExerciseUser } = Exercise;

app
  .route('/api/exercise/new-user')
  .post(
    newExerciseUser
  );


// GET /api/exercise/log?{userId}[&from][&to][&limit]
const { getLog } = Exercise;

app
  .route('/api/exercise/log')
  .get(
    getLog
  );

// File metadata microservice
const fileUpload = require('express-fileupload');
app.use(fileUpload());

const { fileAnalyse } = require('./modules/fileMetadata');

app
  .route('/api/fileanalyse')
  .post(
    fileAnalyse
  );


// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
