const rp = require('request-promise');
// const dynamo = new AWS.DynamoDB.DocumentClient();
// const {isEqual} = require('lodash');
const {scrapeIndex} = require('./helpers');

function getIndex(event, context, callback) {
  const url = 'https://finance.yahoo.com/quote/VTSAX/history?p=VTSAX';

  rp(url)
    .then(html => {
      const index = scrapeIndex(html);

      callback(null, index);
    })
};

module.exports = {
  getIndex
}