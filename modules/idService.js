/** url shortener microservice
 * /priv/idService/new
 *
 */
const mongoose = require('mongoose');

// counter db model
const {Counter} = require('../models/Counter');


mongoose.connect(process.env.MONGO_URI);

/** a really poor error 'handler'. maximum airquotes
 * @param {Object} an error object
 */
const genericErrorHandler = (callback) => (err) => {
      // handle database error
      console.error(err.toString());
      callback(err);
  };


/** Create a new short url if it does not exist.
 *  return it if it already exists.
 * @return {Promise} resolves with next id in the sequence
 */
const getNextId = function (callback) {
  //const errorHandler = genericErrorHandler(next);
  return new Promise((resolve, reject) => {

    Counter.findOne({}, (err, doc) => {
      if (err || !doc) {
        Counter.create({count: 1})
          .then((doc) => {
            const id = doc.count;
            doc.count++;
            doc.save();

            resolve(id);
          })
          .catch((err) => {
            console.log('findOne err');
            reject(err);
          });
      } else {
        console.log('getNextId');
        console.log(doc);
        const id = doc.count;
        doc.count++;
        doc.save();

        resolve(id);
      }
    });
  });
};


/**
 * @param {object} req  html request obj
 * @param {object} res  html response obj
 * @return {string} the id that is sent
 */
const sendNextId = async function (req, res) {
  try {
    const id = await getNextId();
    res.json({id})
    return id;
  } catch (err) {
    // TODO: handle error
  }
};


module.exports = {
  getNextId,
  sendNextId,
}
