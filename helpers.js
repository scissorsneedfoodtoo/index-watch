const cheerio = require('cheerio');

function scrapeIndex(html) {
  const $ = cheerio.load(html);
  const name = $('#quote-header-info > div > div > div').text();
  const price = $('#quote-header-info > div > div > div > span').eq(1).text();
  const change = $('#quote-header-info > div > div > div > span').eq(2).text();

  let ticker = name.match(/\(\w+\)/g);
  ticker = ticker[0].replace(/\(|\)/g, '');

  const [priceChange, percentChange] = change.split(' ');

  return {ticker, price, priceChange, percentChange};
}

module.exports = {
  scrapeIndex
};
