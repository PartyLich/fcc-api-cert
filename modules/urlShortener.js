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

const validateUrl = (req, res, next) => {
  next();
};

const createShortUrl = (req, res, next) => {
  ShortUrl.find();
  next();
};

const sendShortUrl = (req, res) => {
  const shortUrl = {};
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