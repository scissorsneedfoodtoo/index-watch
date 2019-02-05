const cheerio = require('cheerio');
const mailgunAPIKey = process.env.MAILGUN_API_KEY;
const mailgunDomain = process.env.MAILGUN_DOMAIN;
const mailgun = require('mailgun-js')({apiKey: mailgunAPIKey, domain: mailgunDomain});

function scrapeIndex(html) {
  const $ = cheerio.load(html);
  const ticker = $('body > div.container.wrapper.clearfix.j-quoteContainer > div.content-region.region--fixed > div:nth-child(1) > div.column.column--full.company > div > div:nth-child(1) > div.company__symbol > span.company__ticker').text();
  const value = $('body > div.container.wrapper.clearfix.j-quoteContainer > div.content-region.region--fixed > div.template.template--aside > div > div > div.intraday__data > h3').text().replace(/\s/g, '');
  const pointChange = $('body > div.container.wrapper.clearfix.j-quoteContainer > div.content-region.region--fixed > div.template.template--aside > div > div > div.intraday__data > bg-quote > span.change--point--q').text();
  const percentChange = $('body > div.container.wrapper.clearfix.j-quoteContainer > div.content-region.region--fixed > div.template.template--aside > div > div > div.intraday__data > bg-quote > span.change--percent--q').text();
  const closingDate = $('body > div.container.wrapper.clearfix.j-quoteContainer > div.content-region.region--fixed > div.template.template--aside > div > div > div.intraday__timestamp > span > bg-quote').text();

  return {ticker, value, pointChange, percentChange, closingDate};
}

function sendEmail(indexObj) {
  const email = {
    from: 'Index Watcher <me@index-watcher.mailgun.org>',
    to: process.env.VERIFIED_EMAIL,
    subject: 'Current Index',
    text: `
      ticker: ${indexObj.ticker},
      value: ${indexObj.value},
      pointChange: ${indexObj.pointChange},
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
