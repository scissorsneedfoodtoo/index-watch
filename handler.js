const rp = require('request-promise');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const {scrapeIndex} = require('./helpers');

function getIndex(event, context, callback) {
  const url = 'https://finance.yahoo.com/quote/VTSAX/history?p=VTSAX';
  let currentIndex;

  rp(url)
    .then(html => {
      currentIndex = scrapeIndex(html);

      // Retrieve last index from DB
      return dynamo.scan({
        TableName: 'storedIndex'
      }).promise();
    })
    .then(res => {
      // Check if currentIndex is the same as the last index in DB
      const newerIndex = res.index ? res.index.closingDate !== currentIndex.closingDate : false;
      const indexToDelete = res.Items[0] ? res.Items[0].listingID : null;
      console.log(res)

      if(newerIndex) {
        return dynamo.delete({
          TableName: 'storedIndex',
          Key: {
            listingID: indexToDelete
          }
        }).promise()
      } else return;
    })
    .then(() => {
      // save currentIndex
      return dynamo.put({
        TableName: 'storedIndex',
        Item: {
          listingID: new Date().toString(),
          index: currentIndex
        }
      }).promise();
    })
    .then(() => {
      callback(null, currentIndex);
    })
    .catch(callback)
};

module.exports = {
  getIndex
}