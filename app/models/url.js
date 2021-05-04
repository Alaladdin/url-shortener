const mongoose = require('mongoose');
const shortid = require('shortid');

const UrlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true,
  },
  shortId: {
    type: String,
    required: true,
    default: shortid.generate,
  },
  owner: {
    type: String,
    required: true,
    default: 'anonymous',
  },
  visitsCount: {
    type: Number,
    default: 0,
  },
}, {
  toObject: {
    versionKey: false,
  },
});

UrlSchema.index({
  url: 1,
  shortId: 1,
  owner: 1,
  visits: 1,
});

module.exports = mongoose.model('url', UrlSchema);
