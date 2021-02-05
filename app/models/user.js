const mongoose = require('mongoose');

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
      required: true,
      minlength: 6,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
);

module.exports = mongoose.model('user', UserSchema);
