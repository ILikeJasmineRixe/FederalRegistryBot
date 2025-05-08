const puppeteer = require('puppeteer');
const fs = require('fs/promises');

(async () => {
    let donaldTrumpElonSmut;

    try {
        donaldTrumpElonSmut = await fs.readFile('./federal-registry/smut.txt', 'utf8');
    } catch (err) {
        console.error("Error reading smut.txt:", err);
        return;
    }

    // the donaldtrumpshit is now out of scope and can be used outside the try-catch block.

    function randomDelay(min, max) {
        return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
    }

    async function delayGen() {
        if (count % 2 !== 0) {
            await randomDelay(1250, 4000);
        } else {
            await randomDelay(500, 6000);
        }
    }

    let count = 1;

    while (count > 0) {

        let failureAttempts = 0;

        if (count == 1) {
            console.log("Running First Attempt");
        }

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.setViewport({ width: 1920, height: 1080 });
        await page.setExtraHTTPHeaders({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.3',
            'accept-language': 'en-US,en;q=0.9',
        });

        await page.setCacheEnabled(false);

        await page.setRequestInterception(true);
        page.on('request', (req) => {
            const blockTypes = ['image', 'font'];
            if (blockTypes.includes(req.resourceType())) {
                req.abort(); // skip it
            } else {
                req.continue(); // load it
            }
        });

        await page.goto('https://www.federalregister.gov/documents/2025/04/17/2025-06746/rescinding-the-definition-of-harm-under-the-endangered-species-act#open-comment', { waitUntil: 'networkidle2' });

        await randomDelay(300, 700);

        if (count % 2 !== 0) {
            await page.screenshot({ path: `./federal-registry/screenshits/OnloadV2-${count}.jpg` });
        }

        await page.waitForSelector('#comment_comment', { visible: true });
        await page.type('#comment_comment', donaldTrumpElonSmut);

        await randomDelay(100, 1000);

        await page.waitForSelector('.col-xs-12.col-md-4.submitter-type-js[data-submitter-type="anonymous"] input[type="radio"]', { visible: true });
        await page.click('.col-xs-12.col-md-4.submitter-type-js[data-submitter-type="anonymous"] input[type="radio"]');

        await page.waitForSelector('#comment_confirm_submission', { visible: true });
        await page.click('#comment_confirm_submission');

        await page.evaluate(() => {
            window.scrollTo(1920, 690);
        });

        await randomDelay(100, 700);

        if (count % 2 !== 0) {
            await page.screenshot({ path: `./federal-registry/screenshits/BeforeClickingV2-${count}.jpg` });
        }

        await page.waitForSelector('#comment_submit_action', { visible: true });
        await page.click('#comment_submit_action');


        await delayGen();

        if (count % 2 !== 0) {
            await page.screenshot({ path: `./federal-registry/screenshits/AfterClickingV2-${count}.jpg` });
        }

        const titleBarExists = await page.$('h3.title_bar') !== null;

        if (titleBarExists) {
            failureAttempts++ // Increase Count for this variable
            console.log(`${count} - Attempt Failure, Error Below`) // Debug logs
            console.log("h3.title_bar found. Pausing for 10 seconds and closing browser."); // Debug logs
            await page.screenshot({ path: `./federal-registry/screenshits/TitleBarNotFoundV2-${count}-Failure:${failureAttempts}.jpg` }); // Take a screenshot
            const pageContents = await page.content(); // Get Page code and save it 
            fs.writeFile('./federal-registry/fuckedContents.html', pageContents, (error) => {
                if (error) throw error;
                console.log(error);
            });

            if (failureAttempts > 10) {
                await randomDelay(12000, 60000) // 12s-1m
            } else {
                await randomDelay(5000, 14000); // 5-14 seconds
            }
            await browser.close(); // Close web browser
            continue; // retries the loop
        }

        /*
        const pageContents = await page.content();
        fs.writeFile('pageContents.html', pageContents, (error) => {
            if (error) throw error;
            console.log(error);
        });
        */

        await page.waitForSelector('div p.info', { visible: true });

        // await page.setCacheEnabled(false);

        await browser.close();
        console.log(`${count} Attempt Complete`);
        count++;

        await randomDelay(100, 2500)
    }

    console.log("bye bye");


})();
