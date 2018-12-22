const {scrapeIndex} = require('./helpers');

async function getIndex(event, context, callback) {
  const index = await scrapeIndex();

  callback(null, index);
};

module.exports = {
  getIndex
}