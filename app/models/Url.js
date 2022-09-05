const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

const nanoId = customAlphabet('6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz', 6);

const UrlSchema = new mongoose.Schema(
  {
    description: {
      type     : String,
      maxlength: 255,
      trim     : true,
      required : true,
    },
    url: {
      type     : String,
      minlength: 1,
      unique   : true,
      trim     : true,
      required : true,
    },
    shortId: {
      type    : String,
      default : () => nanoId(),
      unique  : true,
      required: true,
    },
    visitedTimes: {
      type   : Number,
      min    : 0,
      default: 0,
    },
    user: {
      type    : mongoose.Schema.Types.ObjectId,
      ref     : 'User',
      required: true,
    },
  }, { versionKey: false },
);

module.exports = mongoose.model('Urls', UrlSchema);
