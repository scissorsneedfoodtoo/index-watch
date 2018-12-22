const request = require('request');
const {scrapeIndex} = require('./helpers');

function getIndex(event, context, callback) {
  const url = 'https://finance.yahoo.com/quote/VTSAX/';

  request(url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      const index = scrapeIndex(html);

      callback(null, index);
    }
  });
};

module.exports = {
  getIndex
}