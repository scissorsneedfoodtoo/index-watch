const cheerio = require('cheerio');
const mailgun = require('mailgun-js')({ 
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});

function scrapeIndex(html) {
  const $ = cheerio.load(html);
  const name = $('#quote-header-info > div > div > div').text();
  const price = $('#quote-header-info > div > div > div > span').eq(1).text();
  const change = $('#quote-header-info > div > div > div > span').eq(2).text();
  const closingDate = $('#Col1-1-HistoricalDataTable-Proxy > section > div > table > tbody > tr:nth-child(1) > td > span').eq(0).text();

  let ticker = name.match(/\(\w+\)/g);
  ticker = ticker[0].replace(/\(|\)/g, '');

  const [priceChange, percentChange] = change.split(' ');

  return {ticker, price, priceChange, percentChange, closingDate};
}

function sendEmail() {
  

  console.log(mailgun);
}

module.exports = {
  scrapeIndex,
  sendEmail
};
