const mongoose = require('mongoose');
const shortid = require('shortid');

// owner - generate hash and save it in localStorage
const UrlSchema = new mongoose.Schema({
  url: { type: String, required: true },
  shortId: { type: String, required: true, default: shortid.generate },
  owner: { type: String, required: true, default: 'anonymous' },
});

module.exports = mongoose.model('url', UrlSchema);
