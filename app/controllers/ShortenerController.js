const Url = require('../models/Url');

const redirect = async (req, res) => {
  const { shortId } = req.params;

  if (!shortId)
    return res.status(400).json({ message: '"shortId" was not provided' });

  try {
    const urlData = await Url.findOne({ shortId }).lean();

    console.log({ urlData });

    if (!urlData)
      return res.status(404).json({ message: 'invalid url' });

    await Url.updateOne({ shortId }, { visitedTimes: urlData.visitedTimes + 1 });

    return res.redirect(urlData.url);
  } catch (err) {
    console.error(err);

    return res.status(500).json({ message: 'some error has occurred' });
  }
};

const notFound = async (req, res) => res.status(404).json({ error: 'method not found' });

module.exports = { redirect, notFound };
