/** url shortener microservice
 * /api/shorturl/new
 * [] 1. I can POST a URL to [project_url]/api/shorturl/new and I will receive a
 * shortened URL in the JSON response.
 *   e.g  {"original_url":"www.google.com","short_url":1}
 [] check for url existence in db
 [] create if DNE
 [] return formatted response
 * 2. If I pass an invalid URL that doesn't follow the
 * http(s)://www.example.com(/more/routes) format, the JSON response will 
 * contain an error like {"error":"invalid URL"}
 [] validates url
 [x] returns proper error if invalid
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


const reStripProtocol = /^(http(s)?:\/\/)?(.*)$/i;
const stripProtocol = (url) => reStripProtocol.match(url)[3];

/** validate long url provided by user
 */
const validateUrl = (req, res, next) => {
  // const longUrl = req.body.url;
  const longUrl = 'www.freecodecamp.org';
  const dns = require('dns');
  const dnsPromises = require('dns').promises;
  
  console.info('longUrl: ' + longUrl);
  // dnsPromises.lookup(longUrl)
  //   .then((data)=> {
  //     console.log('lookup success');
  //     req.invalid = false;
  //     next();
  //   })
  //   .catch((err) => {
  //     console.info('lookup fail: ' + err.toString());
  //     req.invalid = true;
  //     next();
  //   });
  const { Resolver } = require('dns');
  const resolver = new Resolver();
  resolver.setServers(['8.8.4.4', '8.8.8.8']);
  
  resolver.resolve(longUrl, (err, data) => {
    if(err) {      
      console.info('lookup fail: ' + err.toString());
      req.invalid = true;
      return next();
    }
    
    console.log('lookup success');
    req.invalid = false;
    next();
  });
  
//   dns.lookup(longUrl, (err, data) => {
//     if(err) {
//       console.info('lookup fail: ' + err.toString());
//       req.invalid = true;
//       return next();
//     }
    
//     console.log('lookup success');
//     req.invalid = false;
//     next();
//   })
};

/**
 */
const createShortUrl = (req, res, next) => {
  if(req.invalid) return next();
  console.log(`req.invalid ${req.invalid}`);
  // ShortUrl.find();
  
  // const longUrl = req.body.url;
  const longUrl = 'www.google.com';
  let shortUrl = '1';
  
  
  req.shortUrl = {
    original_url: longUrl,
    short_url: shortUrl,
  };
  next();
};

/** send json response
 */ 
const sendShortUrl = (req, res) => {
  const invalidUrl = {"error":"invalid URL"};
  
  if(req.invalid) res.json(invalidUrl);
  const shortUrl = req.shortUrl;
  // const shortUrl = {"original_url":"www.google.com","short_url":1};
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