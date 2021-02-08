const Url = require('../models/url');
const User = require('../models/user');

const GetUrlList = async (req, res) => {
  const { user } = req;
  if (user) {
    const urlList = await Url.find({ owner: user.username }, (err) => {
      if (err) return res.status(500).json({ message: 'some error occurred' });
    })
      .then((list) => {
        const clearedUrlList = [];
        list.forEach((listEl) => {
          clearedUrlList.push({
            url: listEl.url,
            shortId: listEl.shortId,
          });
        });

        return clearedUrlList;
      })
      .catch((err) => err);
    return res.status(200).json({ urlList });
  }

  return res.status(403).json({ message: 'need to be logged' });
};

const WebInterface = async (req, res) => {
  const usersCount = await User.countDocuments({ role: 'guest' });
  const { user } = req;
  const isLogged = req.isAuthenticated();
  let clearedUser = {};

  if (user) {
    clearedUser = {
      username: user.username,
      role: user.role,
      maxUrls: user.maxUrls,
      date: user.date,
    };
  }

  return res.render('index', {
    pageTitle: 'URL shortener',
    usersCount,
    user: clearedUser,
    isLogged,
  });
};

module.exports = {
  WebInterface,
  GetUrlList,
};
