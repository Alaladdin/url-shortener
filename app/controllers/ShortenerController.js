const validator = require('validator');
const Url = require('../models/url');

const Redirect = async (req, res) => {
  const { shortId } = req.params;

  if (!shortId) return res.status(400).json({ message: 'id not provided' });

  try {
    const URL = await Url.findOne({ shortId });
    if (!URL) return res.status(400).json({ message: 'invalid url id' });
    return res.redirect(URL.url);
  } catch (error) {
    return res.status(500).json({ message: 'some error occurred' });
  }
};

const AddUrl = async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ message: 'url not provided' });

  if (!validator.isURL(url, { require_protocol: true })) {
    return res.status(400).json({ message: 'invalid url' });
  }

  try {
    const URL = await Url.findOne({ url });
    if (!URL) {
      const newURL = new Url({ url });
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

  if (!url) return res.status(400).json({ message: 'id not provided' });

  try {
    const URL = await Url.findOne({ url });
    if (!URL) return res.status(400).json({ message: 'invalid url id' });
    await URL.remove();
    return res.status(200).json({ message: 'url was deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'some error occurred' });
  }
};

const GetUrlList = async (req, res) => {
  const urlList = await Url.find((err) => {
    if (err) return res.status(500).json({ message: 'some error occurred' });
  });

  return res.status(200).json({ urlList });
};

const WebInterface = async (req, res) => {
  res.render('index', {
    version: '1.0.4',
  });
};

module.exports = {
  Redirect,
  AddUrl,
  DeleteUrl,
  WebInterface,
  GetUrlList,
};
