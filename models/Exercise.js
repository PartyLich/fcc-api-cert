const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// exercise schema
const exerciseSchema = new Schema({
  description: {
    // "jogging",
    type: String,
    required: true,
  },
  duration: {
    // 15,
    type: Number,
    required: true,
  },
  userId: {
    // "Bk4ury1rH",
    type: String,
    required: true,
  },
  date: {
    // "Fri Jul 12 2019"
    type: Date,
    required: true,
  },
});

// exercise model
const Exercise = new mongoose.model('Exercise', exerciseSchema);

module.exports = {
  Exercise,
};
