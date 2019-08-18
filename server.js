// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

/**
 * A date string is valid if can be successfully parsed by new Date(date_string) (JS) . 
 * Note that the unix timestamp needs to be an integer (not a string) specifying milliseconds.
 * In our test we will use date strings compliant with ISO-8601 (e.g. "2016-11-20") because this 
 * will ensure an UTC timestamp.
 * If the date string is empty it should be equivalent to trigger new Date(), 
 *  i.e. the service uses the current timestamp.
 * If the date string is valid the api returns a JSON having the structure 
 *  {"unix": <date.getTime()>, "utc" : <date.toUTCString()> } 
 *  e.g. {"unix": 1479663089000 ,"utc": "Sun, 20 Nov 2016 17:31:29 GMT"}.
 * If the date string is invalid the api returns a JSON having the structure 
 *  {"unix": null, "utc" : "Invalid Date" }.
 * It is what you get from the date manipulation functions used above.
 */
const reIso8601 = /^\d{4}-\d{2}-\d{2}$/;
const reDigits = /^\d*$/;
const isValidTime = (timeStr) => reIso8601.test(timeStr) || reDigits.test(timeStr);
const formatDate = (date) => ({
      unix: date.getTime(),
      utc: date.toUTCString(),
    });
function middleTest(req, res, next) {
  const timeStr = req.params.date_string;
  
    let date;
    
    if(!timeStr) {
      date = new Date();
    } else if(isValidTime(timeStr)) {      
      date = (reIso8601.test(timeStr)) ? new Date(timeStr) : new Date(parseInt(timeStr));      
    } else {
      date = new Date('x');
    } 
  
  req.date = date;
  next();
}
const serveTimestamp = (req, res) => {
    const dateResponse = formatDate(req.date);
    res.json(dateResponse);      
  };

app.route('/api/timestamp/:date_string?')
  .get(middleTest, )
  ;



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});