// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();

// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const bodyParser = require('body-parser');

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// body parser middleware
app.use(bodyParser.urlencoded({extended: false}));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

/** Timestamp microservice
 * /api/timestamp/:date_string?
 * 
 * If the date string is empty it should be equivalent to trigger new Date(), 
 *  i.e. the service uses the current timestamp.
 * If the date string is valid the api returns a JSON having the structure 
 *  {"unix": <date.getTime()>, "utc" : <date.toUTCString()> } 
 *  e.g. {"unix": 1479663089000 ,"utc": "Sun, 20 Nov 2016 17:31:29 GMT"}.
 * If the date string is invalid the api returns a JSON having the structure 
 *  {"unix": null, "utc" : "Invalid Date" }
 */
const {parseDate, serveTimestamp} = require('./modules/timeStamp') 

app.route('/api/timestamp/:date_string?')
  .get(parseDate, serveTimestamp);

/** Whoami microservice
 * [base url]/api/whoami
 * {"ipaddress":"159.20.14.100","language":"en-US,en;q=0.5",
 * "software":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0"}
 */
const {whoami} = require('./modules/whoami');

app.route('/api/whoami')
  .get(whoami);


/** url shortener microservice
 * /api/shorturl/new
 */
const shortUrl = require('./modules/urlShortener');
const { validateUrl } = shortUrl;
const { createShortUrl } = shortUrl;
const { sendShortUrl } = shortUrl;
const { lookupShortUrl } = shortUrl;
const { redirectToUrl } = shortUrl;

app
  .route('/api/shorturl/new')
  .post(
      validateUrl,
      createShortUrl,
      sendShortUrl
   )
  .get((req, res) => res.sendFile(__dirname + '/views/urlShortener.html'));

app
  .route('/api/shorturl/:url_id')
  .get(
      lookupShortUrl,
      redirectToUrl
  );


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});