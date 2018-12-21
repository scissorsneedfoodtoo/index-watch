const puppeteer = require('puppeteer');

function scrapeIndexPrice() {
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.google.com/search?q=vtsax');
    
    // const currPrice = await page.evaluate(() => document.querySelector('#knowledge-finance-wholepage__entity-summary > div > g-card-section > div > g-card-section > div.gsrt > span:nth-child(1) > span > span').innerText);
    // const priceChange = await page.evaluate(() => document.querySelector('#knowledge-finance-wholepage__entity-summary > div > g-card-section > div > g-card-section > div.gsrt > span > span').innerText);
    // const percentChange = await page.evaluate(() => document.querySelector('#knowledge-finance-wholepage__entity-summary > div > g-card-section > div > g-card-section > div.gsrt > span > span:nth-child(2) > span').innerText);
    const data = await page.evaluate(() => document.querySelector('#knowledge-finance-wholepage__entity-summary > div > g-card-section > div > g-card-section > div.gsrt').innerText);
    
    const test = data.split(' ');
    console.log(test);
  
    await browser.close();
  })();
}

module.exports = {
  scrapeIndexPrice
};
