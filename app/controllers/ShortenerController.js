const Url = require('../models/Url');

const redirect = async (req, res) => {
  const { shortId } = req.params;

  if (!shortId)
    return res.status(400).json({ message: '"shortId" was not provided' });

  try {
    const urlData = await Url.findOne({ shortId })
      .select({ url: 1, visitedTimes: 1 })
      .lean()
      .cache({ update: true });

    if (!urlData)
      return res.status(404).json({ message: 'invalid url' });

    await Url.updateOne(
      { shortId },
      { visitedTimes: urlData.visitedTimes + 1 },
      { clearCache: false }
    );

    return res.redirect(307, urlData.url);
  } catch (err) {
    console.error(err);

    return res.status(500).json({ message: 'some error has occurred' });
  }
};

const notFound = async (req, res) => res.status(404).json({ error: 'method not found' });

module.exports = { redirect, notFound };
