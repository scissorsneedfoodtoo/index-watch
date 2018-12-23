const request = require('request');
const {scrapeIndex} = require('./helpers');

function getIndex(event, context, callback) {
  const url = 'https://finance.yahoo.com/quote/VTSAX/history?p=VTSAX';

  request(url, function (err, res, body) {
    if (!err && res.statusCode == 200) {
      const index = scrapeIndex(body);

      callback(null, index);
    }
  });
};

module.exports = {
  getIndex
}