const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Local Strategy
passport.use(
  new LocalStrategy({}, (username, password, done) => {
    User.findOne({ username })
      .then((user) => {
        // Create new user
        if (!user) {
          const newUser = new User({ username, password });

          // Hash pass before saving in database
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (bcryptErr, hash) => {
              if (bcryptErr) throw bcryptErr;
              newUser.password = hash;
              console.log(newUser);
              newUser
                .save()
                .then((usr) => done(null, usr))
                .catch((error) => done(null, false, { message: error }));
            });
          });
        } else {
          // Return existing user
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, user);
            }
            return done(null, false, { message: 'wrong password' });
          });
        }
      })
      .catch((err) => done(null, false, { message: err }));
  }),
);

module.exports = passport;
