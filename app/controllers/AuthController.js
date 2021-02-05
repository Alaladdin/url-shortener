const passport = require('passport');

const Login = (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return res.status(400).json({ errors: err });
    if (!user) return res.status(400).json({ errors: 'user not found' });

    req.logIn(user, (error) => {
      if (error) res.status(400).json({ errors: err });
      return res.status(200).json({ success: `logged in as ${user.username}` });
    });
  })(req, res, next);
};

module.exports = {
  Login,
};
