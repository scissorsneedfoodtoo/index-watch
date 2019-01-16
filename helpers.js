const cheerio = require('cheerio');
const mailgunAPIKey = process.env.MAILGUN_API_KEY;
const mailgunDomain = process.env.MAILGUN_DOMAIN;
const mailgun = require('mailgun-js')({apiKey: mailgunAPIKey, domain: mailgunDomain});

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

function sendEmail(indexObj) {
  const email = {
    from: 'Index Watcher <me@index-watcher.mailgun.org>',
    to: process.env.VERIFIED_EMAIL,
    subject: 'Current Index',
    text: `
      ticker: ${indexObj.ticker},
      price: ${indexObj.price},
      priceChange: ${indexObj.priceChange},
      percentChange: ${indexObj.percentChange},
      closingDate: ${indexObj.closingDate}
    `
  }

  mailgun.messages().send(email, function(err, body) {
    console.log('sending email');
    console.log(body);
  });
}

module.exports = {
  scrapeIndex,
  sendEmail
};
