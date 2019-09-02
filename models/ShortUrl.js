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

module.exports = {
  ShortUrl,
};
