const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ 'headless': true });
  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.3',
    'accept-language': 'en-US,en;q=0.9', // testicular torsion
   }); 
  await page.goto('https://www.federalregister.gov/documents/2025/04/17/2025-06746/rescinding-the-definition-of-harm-under-the-endangered-species-act#open-comment');

  // HAHA FUCK YOU YOU PIECE OF SHIT LMFAO
  await page.type('#comment_comment', 'Recently thr integration of cock sucking in the political offices has exceeded past homosexuality theories, clearly showing an incline in the homosexual male agenda.'); 

  await new Promise(res => setTimeout(res, 300));

  await page.click('.col-xs-12.col-md-4.submitter-type-js[data-submitter-type="anonymous"] input[type="radio"]');

  // await new Promise(res => setTimeout(res, 5000));

  await page.click('#comment_confirm_submission');

  await page.evaluate(() => {
    window.scrollTo(1920, 690);
  });

  await new Promise(res => setTimeout(res, 500));

  await page.screenshot({ 'path': 'heheScreenshot.png' });

  await page.click('#comment_submit_action')

  await new Promise(res => setTimeout(res, 2000));

  await page.screenshot({ 'path': 'afterClicking.png' });

  console.log("bye bye");

  /*
  const pageContents = await page.content();
  fs.writeFile('pageContents.html', pageContents, (error) => {
    if (error) throw error; 
    console.log(error);
  });


*/
  await browser.close()
})();