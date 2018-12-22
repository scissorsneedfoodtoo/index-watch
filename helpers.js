const cheerio = require('cheerio');

function scrapeIndex(html) {
  const $ = cheerio.load(html);
  const price = $('#quote-header-info > div > div > div > span').eq(1).text();
  let change = $('#quote-header-info > div > div > div > span').eq(2).text();

  const [priceChange, percentChange] = change.split(' ');

  return {price, priceChange, percentChange};
}

module.exports = {
  scrapeIndex
};
