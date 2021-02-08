const validator = require('validator');
const Url = require('../models/url');

const Redirect = async (req, res) => {
  const { shortId } = req.params;

  if (!shortId) return res.status(400).json({ message: 'id not provided' });

  try {
    const URL = await Url.findOne({ shortId });
    if (!URL) return res.status(404).json({ message: 'invalid url' });
    return res.redirect(URL.url);
  } catch (error) {
    return res.status(500).json({ message: 'some error occurred' });
  }
};

const AddUrl = async (req, res) => {
  const { url } = req.body;
  const { username, maxUrls } = req.user;
  const urlsCount = await Url.countDocuments({ owner: username });
  if (!username) return res.status(403).json({ message: 'need to be logged' });
  if (urlsCount >= maxUrls)
    return res.status(400).json({ message: `you have reached the urls limit: ${maxUrls}` });
  if (!url) return res.status(400).json({ message: 'url not provided' });

  if (!validator.isURL(url, { require_protocol: true })) {
    return res.status(400).json({ message: 'invalid url' });
  }

  try {
    const URL = await Url.findOne({ owner: username, url });
    if (!URL) {
      const newURL = new Url({ owner: username, url });
      await newURL.save();
      return res.status(201).json({ shortId: newURL.shortId, url });
    }

    return res.status(409).json({ message: 'url already exists' });
  } catch (error) {
    return res.status(500).json({ message: 'some error occurred' });
  }
};

const DeleteUrl = async (req, res) => {
  const { url } = req.body;
  const { username } = req.user;

  if (!username) return res.status(403).json({ message: 'need to be logged' });
  if (!url) return res.status(400).json({ message: 'id not provided' });

  try {
    const URL = await Url.findOne({ owner: username, url });
    if (!URL) return res.status(400).json({ message: 'invalid url id' });
    await URL.remove();
    return res.status(200).json({ message: 'url was deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'some error occurred' });
  }
};

module.exports = {
  Redirect,
  AddUrl,
  DeleteUrl,
};
