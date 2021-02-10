const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minlength: 2,
      maxlength: 10,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
      maxlength: 12,
      trim: true,
    },
    maxUrls: {
      type: Number,
      default: 3,
      index: true,
    },
    role: {
      type: String,
      default: 'guest',
      index: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    toObject: {
      versionKey: false,
    },
  },
);

UserSchema.index({
  username: 1,
  maxUrls: 1,
  role: 1,
  registeredAt: -1,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', UserSchema);
