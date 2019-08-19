/** url shortener microservice
 * /api/shorturl/new
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
  const longUrl = req.query.;
  next();
};

/**
 */
const createShortUrl = (req, res, next) => {
  ShortUrl.find();
  
  let original_url = 'www.google.com';
  let short_url = '1';
  
  
  req.shortUrl = {
    original_url,
    short_url,
  };
  next();
};

/** send json response
 */ 
const sendShortUrl = (req, res) => {
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