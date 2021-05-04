const Url = require('../models/url');

const GetUrlList = async (req, res) => {
  const { user } = req;
  if (!user) return res.status(403).json({ message: 'need to be logged in' });

  const cacheKey = `${user.username}__url-list`;
  const urlList = await Url.find({ owner: user.username }, (err) => {
    if (err) return res.status(500).json({ message: 'some error was occurred', error: err });
  })
    .select({ url: 1, shortId: 1, visitsCount: 1 })
    .lean()
    .cache(600, cacheKey)
    .catch((err) => console.error(err));

  return res.status(200).json({ urlList });
};

const WebInterface = async (req, res) => {
  const { user } = req;
  const isLogged = req.isAuthenticated();
  return res.render('index', {
    pageTitle: 'Shortener',
    isLogged,
    user: user || { username: 'Mr.Anderson' },
  });
};

const RegisterView = (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/');

  return res.render('register', {
    pageTitle: 'Register',
  });
};

const LoginView = (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/');

  return res.render('login', {
    pageTitle: 'Login',
  });
};

const Logout = (req, res) => {
  req.logout();
  return res.redirect('/');
};

module.exports = {
  WebInterface,
  GetUrlList,
  RegisterView,
  LoginView,
  Logout,
};
