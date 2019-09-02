const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// user db schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
});

// user db model
const User = mongoose.model('User', userSchema);

module.exports = {
  User,
};
