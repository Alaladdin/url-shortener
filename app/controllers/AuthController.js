const passport = require('passport');
const User = require('../models/user');

const RegisterView = (req, res) => {
  if (req.isAuthenticated()) res.redirect('/');
  return res.render('register', {
    pageTitle: 'Register',
  });
};

const Register = (req, res) => {
  const { username, password } = req.body;
  User.register(
    new User({ username }), password, (err) => {
      if (err) return res.status(400).json({ message: err });

      return passport.authenticate('local')(req, res, () => res.redirect('/'));
    },
  );
};

const Login = (req, res) => {
  passport.authenticate('local', (err, user) => {
    if (err) return res.status(400).json({ errors: err });
    if (!user) return res.status(400).json({ errors: 'login or pass is not correct' });

    req.logIn(user, (error) => {
      if (error) return res.status(400).json({ errors: err });
      return res.redirect('/');
    });
  })(req, res);
};

const LoginView = (req, res) => {
  if (req.isAuthenticated()) res.redirect('/');
  return res.render('login', {
    pageTitle: 'Login',
  });
};

const LogoutView = (req, res) => {
  req.logout();
  res.redirect('/');
};

module.exports = {
  Login,
  LoginView,
  Register,
  RegisterView,
  LogoutView,
};
