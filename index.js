const puppeteer = require('puppeteer');
const assert = require('assert');
const worker = require('./worker.js');


(async () => {
    URL = 'https://demoqa.com/text-box';
    const browser = await puppeteer.launch({
        headless:false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--hide-scrollbars',
            '--disable-web-security',
            '--disable-notifications'
        ]
    });
    const page = await browser.newPage();
    await page.goto(URL, {
        waitUntil: ['networkidle2', 'domcontentloaded'],
    });
    let user = {userName:"John", userEmail:"John@gmail.com", currentAddress:"currentAddress", permanentAddress:"permanentAddress"};
    let userN = {userName:"John", userEmail:"Johngmail.com", currentAddress:"currentAddress", permanentAddress:"permanentAddress"};
    
    await testTextBox_Positive(browser, page, user);
    await page.reload();
    //await clearAll(browser, page);
    await testTextBox_Negative(browser, page, userN);
    
    await browser.close();
})();

async function testTextBox_Positive(browser, page, user){
    worker.fillForm(browser, page, user);

    await new Promise(resolve => setTimeout(resolve, worker.getRndInteger(5000, 10000)));
    let isOutput = await worker.isOutputPresent(browser, page, user);
    assert.ok(isOutput);
}
async function testTextBox_Negative(browser, page, user){
    worker.fillForm(browser, page, user);

    await new Promise(resolve => setTimeout(resolve, worker.getRndInteger(10000, 20000)));
    let isOutput = await worker.isOutputPresent(browser, page, user);
    assert.ok(isOutput);
}



