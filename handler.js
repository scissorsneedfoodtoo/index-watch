const {scrapeIndexPrice} = require('./helpers');

const indexPrice = (async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({path: 'example.png'});

  await browser.close();
});

module.exports.getindex = (event, context, callback) => {
  const indexPrice = scrapeIndexPrice();

  return indexPrice;

};