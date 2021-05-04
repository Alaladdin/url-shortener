const validator = require('validator');
const Url = require('../models/url');
const { clearCache } = require('../cache/setup');

const Redirect = async (req, res) => {
  const { shortId } = req.params;

  if (!shortId) return res.status(400).json({ message: 'id not provided' });

  try {
    const URL = await Url.findOne({ shortId })
      .select({ url: 1, visitsCount: 1 });
    if (!URL) return res.status(404).json({ message: 'invalid url' });

    await URL.updateOne({ visitsCount: URL.visitsCount + 1 });
    return res.redirect(URL.url);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'some error has occurred' });
  }
};

const AddUrl = async (req, res) => {
  const { url } = req.body;
  const { username, maxUrls } = req.user;
  const userUrlsCount = await Url.countDocuments({ owner: username });

  if (!username) return res.status(403).json({ message: 'need to be logged' });
  if (userUrlsCount >= maxUrls) return res.status(400).json({ message: `you have reached the urls limit: ${maxUrls}` });

  if (!url) return res.status(400).json({ message: 'url not provided' });
  if (!validator.isURL(url, { require_protocol: true })) return res.status(400).json({ message: 'invalid url' });

  try {
    const userCacheList = `${username}__url-list`;
    const URL = await Url.findOne({ owner: username, url });

    if (!URL) {
      const newURL = new Url({ owner: username, url });
      await newURL.save();
      clearCache(userCacheList);
      return res.status(201).json({ shortId: newURL.shortId, url, visitsCount: 0 });
    }

    return res.status(409).json({ message: 'url already exists' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'some error occurred' });
  }
};

const DeleteUrl = async (req, res) => {
  const { url } = req.body;
  const { username } = req.user;

  if (!username) return res.status(403).json({ message: 'need to be logged' });
  if (!url) return res.status(400).json({ message: 'id not provided' });

  try {
    const userCacheList = `${username}__url-list`;
    const URL = await Url.deleteOne({ owner: username, url });
    if (!URL) return res.status(400).json({ message: 'invalid url' });
    clearCache(userCacheList);
    return res.status(200).json({ message: 'url was deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'some error occurred' });
  }
};

module.exports = {
  Redirect,
  AddUrl,
  DeleteUrl,
};
