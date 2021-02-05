const Url = require('../models/url');

const GetUrlList = async (req, res) => {
  const urlList = await Url.find((err) => {
    if (err) return res.status(500).json({ message: 'some error occurred' });
  }).then((list) => {
    const clearedUrlList = [];
    list.forEach((listEl) => {
      clearedUrlList.push({
        url: listEl.url,
        shortId: listEl.shortId,
      });
    });

    return clearedUrlList;
  });

  return res.status(200).json({ urlList });
};

const WebInterface = (req, res) => {
  return res.render('index', {
    version: '1.0.7',
  });
};

module.exports = {
  WebInterface,
  GetUrlList,
};
