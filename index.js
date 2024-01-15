const puppeteer = require('puppeteer');
const assert = require('assert');

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
    fillForm(browser, page, user);

    await new Promise(resolve => setTimeout(resolve, getRndInteger(5000, 10000)));
    let isOutput = await isOutputPresent(browser, page, user);
    assert.ok(isOutput);
    
    
    await browser.close();
})();

async function isOutputPresent(browser, page, user){
    if(user.userName!=""){
        const name = await page.$eval('#name', el => el.textContent );
        if(!name.includes(user.userName))
            return false;
    }
    if(user.userEmail!=""){
        const email = await page.$eval('#email', el => el.textContent );
        if(!email.includes(user.userEmail))
            return false;
    }
    if(user.currentAddress!=""){
        const currentAddress = await page.$eval('#email', el => el.textContent );
        if(currentAddress.includes(user.currentAddress))
            return false;
    }
    if(user.permanentAddress!=""){
        const permanentAddress = await page.$eval('#email', el => el.textContent );
        if(permanentAddress.includes(user.permanentAddress))
            return false;
    }
    return true;
}

async function fillForm(browser, page, user) {
    await page.type('#userName', user.userName);
    await page.type('#userEmail', user.userEmail);
    await page.type('#currentAddress', user.currentAddress);
    await page.type('#permanentAddress', user.permanentAddress);

    await page.click('#submit');
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}
