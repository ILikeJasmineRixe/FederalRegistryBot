const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs').promises;
const path = require('path');

// Add stealth plugin to Puppeteer
puppeteer.use(StealthPlugin());

// Custom sleep function to introduce delays
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Load cookies if they exist
    const cookiesPath = 'cookies.json';
    const previousSession = await fs.readFile(cookiesPath, 'utf8').catch(() => null);
    if (previousSession) {
        const cookies = JSON.parse(previousSession);
        await page.setCookie(...cookies);
        console.log('Session loaded.');
    }

    // Navigate to the form page
    await page.goto('https://enddei.ed.gov/', { waitUntil: 'networkidle2' });

    // Fill out the form fields
    await page.type('#email', 'johndoe@example.com'); // Your Email
    await page.type('#location', 'Sample School District'); // School or school district
    await page.type('#zipcode', '12345'); // ZIP Code
    await page.type('#description', 'This is a sample description for testing purposes.'); // Description

    // Upload a file
    const fileInput = await page.$('#file');
    await fileInput.uploadFile(path.resolve(__dirname, 'donald-trump-sucks.png')); // Update with your file path

    // Introduce a 20-second delay to mimic human behavior
    await sleep(20000); // 20,000 milliseconds = 20 seconds

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for navigation after form submission
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Save cookies to maintain session
    const cookies = await page.cookies();
    await fs.writeFile(cookiesPath, JSON.stringify(cookies, null, 2));
    console.log('Session saved.');

    // Close the browser
    await browser.close();
})();
