const passport = require('passport');
const User = require('../models/user');

const Register = (req, res) => {
  const { username, password } = req.body;
  return User.register(
    new User({ username }), password, (err) => {
      if (err) return res.status(400).json({ message: err });
      return passport.authenticate('local')(req, res, () => res.redirect('/'));
    },
  );
};

const Login = (req, res) => passport.authenticate('local', (err, user) => {
  if (err) return res.status(400).json({ errors: err });
  if (!user) return res.status(400).json({ errors: 'login or pass is not correct' });

  req.logIn(user, (error) => {
    if (error) return res.status(400).json({ errors: err });
    return res.redirect('/');
  });
})(req, res);

const DeleteUser = (req, res) => {
  const { user } = req;
  if (!user) return res.status(403).json({ errors: 'you have no permission to this action' });

  return User.deleteOne({ username: user.username })
    .then(res.status(200).end())
    .catch((err) => res.status(400).json({ errors: err }));
};

module.exports = {
  Login,
  Register,
  DeleteUser,
};
