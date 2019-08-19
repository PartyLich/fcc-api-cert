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
const getNextId = function () {
  //const errorHandler = genericErrorHandler(next);
 
  Counter.findOne({}, (err, doc) => {
    if(err || !doc) {
      Counter.create({count: 1})
        .then((doc) => {
          const id = doc.count;
          doc.count++;
          doc.save();

          return id;
        })
      .catch((err) => console.log(err));
      return;
    }
    
    console.log(doc)
    const id = doc.count;
    doc.count++;
    doc.save();
    
    return id;
  });    
};

const sendNextId = (req, res) => res.json({id: getNextId()});


module.exports = {
  getNextId,
  sendNextId,
}