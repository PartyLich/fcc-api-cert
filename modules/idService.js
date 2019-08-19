/** url shortener microservice
 * /priv/idService/new
 * 
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// url db schema/model
const counterSchema = new Schema({
  count: {
    type: Number,
    required: true,
  }
});
const Counter = mongoose.model('Counter', counterSchema);


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
 */
const getNextId =  function (req, res) {
  //const errorHandler = genericErrorHandler(next);
  
  // check existence
  const query = {url: longUrl};
  Counter.findOne({}, (err, doc) => {
    if(err) {
      Counter.create({count: 1});
    }
    const id = doc.count;
    doc.count++;
    
    res.json({id});
  });
    
};


module.exports = {
  getNextId
}