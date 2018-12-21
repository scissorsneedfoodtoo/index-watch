const puppeteerLambda = require('puppeteer-lambda');

async function scrapeIndex() {
  const browser = await puppeteerLambda.getBrowser({
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('https://www.google.com/search?q=vtsax');

  const data = await page.evaluate(() => document.querySelector('#knowledge-finance-wholepage__entity-summary > div > g-card-section > div > g-card-section > div.gsrt').innerText);
  
  let [price, , priceChange, percentChange] = data.split(' ');

  percentChange = percentChange.replace(/\(|\)/g, '');
  priceChange.includes('+') ? percentChange = '+' + percentChange : percentChange = '−' + percentChange; 

  const indexObj = {price, priceChange, percentChange}

  await browser.close();

  return indexObj;
}

module.exports = {
  scrapeIndex
};
