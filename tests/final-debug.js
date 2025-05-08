const puppeteer = require('puppeteer');
const fs = require('fs/promises');

(async () => {
    let donaldTrumpElonSmut;

    try {
        donaldTrumpElonSmut = await fs.readFile('./federal-registry/smut.txt', 'utf8');
        console.log('Smut File contents assigned to variable -> ftrump')
    } catch (err) {
        console.error("Error reading smut.txt:", err);
        return;
    }

    // the donaldtrumpshit is now out of scope and can be used outside the try-catch block.

    function randomDelay(min, max) {
        return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
    }

    let count = 1;

    while (count > 0) {

        debugLog("count is set to 0");
        
        async function delayGen() {
            if (count % 2 !== 0) {
                await randomDelay(1250, 4000);
            } else {
                await randomDelay(500, 6000);
            }
        }
        
        async function debugLog(debug) {
            if (count == 0 ) {
                console.log(debug)
            }
        }

        debugLog(`Current Count: ${count}`);

        const browser = await puppeteer.launch({ headless: true });
        debugLog("Browser created")
        const page = await browser.newPage();
        debugLog("New Page");

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

        debugLog("Viewport, User Agent, cache preferences, asset blocking, and language set");

        await page.goto('https://www.federalregister.gov/documents/2025/04/17/2025-06746/rescinding-the-definition-of-harm-under-the-endangered-species-act#open-comment', { waitUntil: 'networkidle2' });

        debugLog("successfully visited site")
        await randomDelay(300, 700);

        await page.screenshot({ path: `./federal-registry/debugshits/OnloadV2-${count}.jpg` });
        debugLog("screenshotted");

        await page.waitForSelector('#comment_comment', { visible: true });
        await page.type('#comment_comment', donaldTrumpElonSmut);

        debugLog("Input Smut into text form");

        await randomDelay(100, 1000);

        await page.waitForSelector('.col-xs-12.col-md-4.submitter-type-js[data-submitter-type="anonymous"] input[type="radio"]', { visible: true });
        await page.click('.col-xs-12.col-md-4.submitter-type-js[data-submitter-type="anonymous"] input[type="radio"]');

        await page.waitForSelector('#comment_confirm_submission', { visible: true });
        await page.click('#comment_confirm_submission');

        debugLog("Pressed Buttons hehe");

        await page.evaluate(() => {
            window.scrollTo(1920, 690);
        });

        await randomDelay(100, 700);

            await page.screenshot({ path: `./federal-registry/debugshits/BeforeClickingV2-${count}.jpg` });

        await page.waitForSelector('#comment_submit_action', { visible: true });
        await page.click('#comment_submit_action');

        debugLog("submitted form");


        await delayGen();

            await page.screenshot({ path: `./federal-registry/debugshits/AfterClickingV2-${count}.jpg` });

        debugLog("checking for title bar - error check");

        const titleBarExists = await page.$('h3.title_bar') !== null;

        if (titleBarExists) {
            console.log("h3.title_bar found. Pausing for 6.5 seconds and closing browser.");
            await page.screenshot({ path: `./federal-registry/debugshits/TitleBarNotFoundV2-${count}.jpg` });
            const pageContents = await page.content();
            fs.writeFile('./federal-registry/fuckedContents.html', pageContents, (error) => {
                if (error) throw error;
                console.log(error);
            });
            await new Promise(resolve => setTimeout(resolve, 6500));
            await browser.close();
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

        debugLog("success");

        // await page.setCacheEnabled(false);

        await browser.close();
        count++;

        await randomDelay(100, 2500)
    }

    console.log("bye bye");


})();
