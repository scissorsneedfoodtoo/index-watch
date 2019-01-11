require('dotenv').config();
const rp = require('request-promise');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const { scrapeIndex, sendEmail } = require('./helpers');

function getIndex(event, context, callback) {
  const url = 'https://finance.yahoo.com/quote/VTSAX/history?p=VTSAX';
  let currentIndex, indexExists, newerIndex;

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
      indexExists = res.Items.length > 0;
      newerIndex = indexExists ? res.Items[0].index.closingDate !== currentIndex.closingDate : false;
      const indexToDelete = res.Items[0] ? res.Items[0].listingID : null;
      
      // console.log(res); // Check response from DB
      sendEmail(); // testing sendEmail

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
      if (!indexExists || newerIndex) {
        return dynamo.put({
          TableName: 'storedIndex',
          Item: {
            listingID: new Date().toString(),
            index: currentIndex
          }
        }).promise();
      } else return;
    })
    .then(() => {
      callback(null, currentIndex);
    })
    .catch(callback);
};

module.exports = {
  getIndex
}