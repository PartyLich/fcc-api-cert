const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// counter db schema
const counterSchema = new Schema({
  count: {
    type: Number,
    required: true,
  },
});
// counter db model
const Counter = mongoose.model('Counter', counterSchema);

module.exports = {
  Counter,
};
