const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const mailgunAPIKey = process.env.MAILGUN_API_KEY;
const mailgunDomain = process.env.MAILGUN_DOMAIN;
const mailgun = require('mailgun-js')({apiKey: mailgunAPIKey, domain: mailgunDomain});

function scrapeIndex(html) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const ticker = doc.querySelector("#symbolDescBlock > h2 > span").textContent;
  const value = doc.querySelector("#firstGlanceQuoteTable > tbody > tr:nth-child(1) > td:nth-child(1)").textContent;
  const pointChange = doc.querySelector("#firstGlanceQuoteTable > tbody > tr:nth-child(1) > td:nth-child(2) > span:nth-child(1)").textContent;
  const percentChange = doc.querySelector("#firstGlanceQuoteTable > tbody > tr:nth-child(1) > td:nth-child(2) > span:nth-child(2)").textContent;
  const rawDate = new Date(doc.querySelector("#firstGlanceQuoteTable > tbody > tr:nth-child(2) > td:nth-child(1)").textContent.replace('Quote data as of close ', ''));
  const closingDate = `${rawDate.toLocaleString('default', { month: 'short' })} ${rawDate.getDate()}, ${rawDate.getFullYear()}`

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
