/** url shortener microservice
 * /api/shorturl/new
 * 1. I can POST a URL to [project_url]/api/shorturl/new and I will receive a
 * shortened URL in the JSON response.
 *   e.g  {"original_url":"www.google.com","short_url":1}
 [] check for url existence in db
 [] create if DNE
 [x] return formatted response
 * 2. If I pass an invalid URL that doesn't follow the
 * http(s)://www.example.com(/more/routes) format, the JSON response will 
 * contain an error like {"error":"invalid URL"}
 [x] validates url
 [x] returns proper error if invalid
 * HINT: to be sure that the submitted url points to a valid site you can 
 * use the function dns.lookup(host, cb) from the dns core module.
 * 3. When I visit the shortened URL, it will redirect me to my original link.
  [] retrieve full url
  [x] redirect
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// url db schema/model
const shortUrlSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  // id: {
  //   type: Number,
  //   required: true,
  // },
});

const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);


mongoose.connect(process.env.MONGO_URI);

/**
 * @param {Object} an error object
 */
const genericErrorHandler = (err) => {
      // handle database error
      console.error(err.toString());
  };

const reStripProtocol = /^(http(s)?:\/\/)?(.*)$/i;
const stripProtocol = (url) => url.match(reStripProtocol)[3];

/** validate long url provided by user
 */
const validateUrl = (req, res, next) => {
  const longUrl = stripProtocol(req.body.url);  
  const dnsPromises = require('dns').promises;
  
  // console.info('longUrl: ' + longUrl);
  dnsPromises.lookup(longUrl)
    .then((data)=> {
      console.info('dns lookup success');
      req.invalid = false;
      next();
    })
    .catch((err) => {
      console.log('dns lookup fail: ' + err.toString());
      req.invalid = true;
      next();
    });
};


const getShortUrlStr = (id) => `/api/shorturl/${id}`;
const getShortUrlObj = (longUrl, shortUrl) => ({
    original_url: longUrl,
    short_url: shortUrl,
  });

const createShortUrl = (longUrl) => ShortUrl.create({url: longUrl});


/**
 */
const createOrReturnShortUrl = (req, res, next) => {
  if(req.invalid) return next();
  console.log(`req.invalid ${req.invalid}`);
  
  // const longUrl = req.body.url;
  const longUrl = 'www.google.com';
  
  // check existence
  const query = {url: longUrl};
  ShortUrl.exists(query)
    .then((exists) => {
      if(exists) {
        console.info(`${longUrl} exists`);
        // return existing shortUrl
        const shortUrlDoc = ShortUrl.findOne(query);
        const id = shortUrlDoc._id;
        const shortUrlString = getShortUrlStr(id);
        req.shortUrl = getShortUrlObj(shortUrlDoc.url, shortUrlString);
        return next();
      } 
    
      console.info('creating new shorturl')
      createShortUrl(longUrl)
          .then((document) => {
            const shortUrlString = getShortUrlStr(document._id);
            req.shortUrl = getShortUrlObj(document.url, shortUrlString);
            return next();
          })
          .catch(genericErrorHandler);
    })
    .catch(genericErrorHandler);
  // ShortUrl.find({url: req.body.url}, (err, data) => {
//   if(err) return next();
//   
//   
// });
  
  
  // let shortUrl = '1';
  
  
  // req.shortUrl = {
  //   original_url: longUrl,
  //   short_url: shortUrl,
  // };
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
  // sanitize
  
  //
// ShortUrl.find({url: req.body.url}, (err, data) => {
//   if(err) return next();
//   
//   
// });
  // const shortUrl = ''
  next();
};

/** send redirect to long url
 */
const redirectToUrl = (req, res) => {
  // const shortUrl = 'https://fcc-timestamp-microservice-x.glitch.me/'
  const longUrl = ''
      + '/api/whoami';
  
  console.log('redirecting');
  res.redirect(longUrl);
};

module.exports = {
  validateUrl,
  createShortUrl,
  sendShortUrl,
  
  lookupShortUrl,
  redirectToUrl,
}