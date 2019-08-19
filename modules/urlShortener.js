/** url shortener microservice
 * /api/shorturl/new
 * 1. I can POST a URL to [project_url]/api/shorturl/new and I will receive a
 * shortened URL in the JSON response.
 *   e.g  {"original_url":"www.google.com","short_url":1}
 * 2. If I pass an invalid URL that doesn't follow the
 * http(s)://www.example.com(/more/routes) format, the JSON response will 
 * contain an error like {"error":"invalid URL"}
 * HINT: to be sure that the submitted url points to a valid site you can 
 * use the function dns.lookup(host, cb) from the dns core module.
 * 3. When I visit the shortened URL, it will redirect me to my original link.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;




// url db schema/model
const shortUrlSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
});

const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);


mongoose.connect(process.env.MONGO_URI);

/** validate long url provided by user
 */
const validateUrl = (req, res, next) => {
  const longUrl = req.body.url;
  
  req.invalid = true;
  
  next();
};

/**
 */
const createShortUrl = (req, res, next) => {
  if(req.invalid) return next();
  console.log(`req.invalid ${req.invalid}`);
  ShortUrl.find();
  
  // const original_url = req.body.url;
  const longUrl = 'www.google.com';
  let short_url = '1';
  
  
  req.shortUrl = {
    original_url: longUrl,
    short_url,
  };
  next();
};

/** send json response
 */ 
const sendShortUrl = (req, res) => {
  const invalidUrl = {"error":"invalid URL"};
  
  if(req.invalid) res.json(invalidUrl);
  // const shortUrl = req.shortUrl;
  const shortUrl = {"original_url":"www.google.com","short_url":1};
  res.json(shortUrl);
};

// get short url from database by id
const lookupShortUrl = (req, res, next) => {
  const urlId = req.params.url_id;
  // const shortUrl = ''
  next();
};

const redirectToUrl = (req, res) => {
  // const shortUrl = 'https://fcc-timestamp-microservice-x.glitch.me/'
  const shortUrl = ''
      + '/api/whoami';
  
  res.redirect(shortUrl);
};

module.exports = {
  validateUrl,
  createShortUrl,
  sendShortUrl,
  
  lookupShortUrl,
  redirectToUrl,
}