const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      minlength: 2,
    },
    password: {
      type: String,
      // required: true,
      minlength: 6,
    },
    maxUrls: {
      type: Number,
      default: 3,
    },
    role: {
      type: String,
      default: 'guest', // admin, user, guest
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
);
// guest - can create only 3 urls and the will will be deleted after 5 minutes
// user - can create 10 urls and the will not be deleted
// admin - full access

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', UserSchema);
