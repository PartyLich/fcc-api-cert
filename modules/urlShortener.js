/** url shortener microservice
 * /api/shorturl/new
 * 1. I can POST a URL to [project_url]/api/shorturl/new and I will receive a
 * shortened URL in the JSON response.
 *   e.g  {"original_url":"www.google.com","short_url":1}
 [x] check for url existence in db
 [x] create if DNE
 [x] return formatted response
 * 2. If I pass an invalid URL that doesn't follow the
 * http(s)://www.example.com(/more/routes) format, the JSON response will
 * contain an error like {"error":"invalid URL"}
 [x] validates url
 [x] returns proper error if invalid
 * HINT: to be sure that the submitted url points to a valid site you can
 * use the function dns.lookup(host, cb) from the dns core module.
 * 3. When I visit the shortened URL, it will redirect me to my original link.
  [x] retrieve full url
  [x] redirect
 */
const { getNextId } = require('../modules/idService');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// url db schema/model
const shortUrlSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  id_url: {
    type: Number,
    required: true,
  },
});
const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

// ShortUrl.deleteOne({"url":"https://www.freecodecamp.org"});

mongoose.connect(process.env.MONGO_URI);

/** a really poor error 'handler'. maximum airquotes
 * @param {Object} an error object
 */
const genericErrorHandler = (callback) => (err) => {
      // handle database error
      console.error(err.toString());
      callback(err);
  };

// http protocol removal. dns lookup fails if we leave it
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


// const getShortUrlStr = (id) => `/api/shorturl/${id}`;
const getShortUrlStr = (id) => `${id}`;
const getShortUrlObj = (longUrl, shortUrl) => ({
    original_url: longUrl,
    short_url: shortUrl,
  });

const createShortUrl = async function (longUrl) {
  try {
    const id_url = await getNextId();
    console.log(`createShortUrl new id: ${id_url}`);
    
    return ShortUrl.create({
      url: longUrl,
      id_url
    });
  } catch (err) {
    console.log('createShortUrl err ' + err.toString());
  }
};


/** Create a new short url if it does not exist.
 *  return it if it already exists.
 */
const createOrReturnShortUrl = (req, res, next) => {
  if (req.invalid) return next(new Error('Long url failed validation'));
  console.log(`req.invalid ${req.invalid}`);

  const errorHandler = genericErrorHandler(next);
  const longUrl = req.body.url;
  // const longUrl = 'www.google.com';

  // check existence
  const query = {url: longUrl};
  ShortUrl.exists(query)
    .then((exists) => {
      if (exists) {
        console.info(`${longUrl} exists`);
        // return existing shortUrl
        ShortUrl.findOne(query)
          .exec((err, doc) => {
            // console.log(doc);
            const shortUrlString = getShortUrlStr(doc.id_url);

            req.shortUrl = getShortUrlObj(doc.url, shortUrlString);
            console.log('extant shortUrlObj: ' + JSON.stringify(req.shortUrl));

            return next();
          });

        // console.info(`deleting ${longUrl}`);
        // ShortUrl.deleteOne(query);
      } else {
        console.info(`creating new shorturl for ${longUrl}`);
        createShortUrl(longUrl)
            .then((document) => {
          console.log(document);
              const shortUrlString = getShortUrlStr(document.id_url);

              req.shortUrl = getShortUrlObj(document.url, shortUrlString);
              console.log('new shortUrlObj: ' + JSON.stringify(req.shortUrl));
              return next();
            })
            .catch(errorHandler);
      }
    })
    .catch(errorHandler);
};

/** send json response
 */ 
const sendShortUrl = (req, res) => {
  const invalidUrl = {'error': 'invalid URL'};

  if (req.invalid) res.json(invalidUrl);
  const shortUrl = req.shortUrl;

  console.log(`sending ${JSON.stringify(shortUrl)}`);
  res.json(shortUrl);
};

// get short url from database by id
const lookupShortUrl = (req, res, next) => {
  const userUrlId = req.params.url_id;
  // sanitize
  const urlId = userUrlId;  // TODO: omg this is so dirty. UNCLEAN

  // ShortUrl.findById(urlId)
  ShortUrl.findOne({id_url: urlId})
    .exec((err, document) => {
      if (err) {
        console.log('findbyId error');
        req.invalid = true;
        // return next(err);
        return next();
      }

      req.longUrl = document.url;
      console.log(`lookup found ${req.longUrl}`);
      return next();
    });
};

/** send redirect to long url
 */
const redirectToUrl = (req, res) => {
  const longUrl = (req.invalid)
      ? '/api/shorturl/new'
      : req.longUrl;

  console.log(`redirecting to ${longUrl}`);
  res.redirect(longUrl);
};


module.exports = {
  newShortUrl: [
    validateUrl,
    createOrReturnShortUrl,
    sendShortUrl,
  ],

  getShortUrl: [
    lookupShortUrl,
    redirectToUrl,
  ],
};
