const puppeteer = require('puppeteer');

async function scrapeIndexPrice() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.google.com/search?q=vtsax');

  const data = await page.evaluate(() => document.querySelector('#knowledge-finance-wholepage__entity-summary > div > g-card-section > div > g-card-section > div.gsrt').innerText);
  
  let [price, , priceChange, percentChange] = data.split(' ');

  percentChange = percentChange.replace(/\(|\)/g, '');
  priceChange.includes('+') ? percentChange = '+' + percentChange : percentChange = '−' + percentChange; 

  const index = {price, priceChange, percentChange}

  await browser.close();

  return index;
}

module.exports = {
  scrapeIndexPrice
};
