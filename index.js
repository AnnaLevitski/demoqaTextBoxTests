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
    let userN = {userName:"John", userEmail:"Johngmail.com", currentAddress:"currentAddress", permanentAddress:"permanentAddress"};
    
    await testTextBox_Positive(browser, page, user);
    await page.reload();
    //await clearAll(browser, page);
    await testTextBox_Negative(browser, page, userN);
    
    await browser.close();
})();

async function testTextBox_Positive(browser, page, user){
    fillForm(browser, page, user);

    await new Promise(resolve => setTimeout(resolve, getRndInteger(5000, 10000)));
    let isOutput = await isOutputPresent(browser, page, user);
    assert.ok(isOutput);
}
async function testTextBox_Negative(browser, page, user){
    fillForm(browser, page, user);

    await new Promise(resolve => setTimeout(resolve, getRndInteger(10000, 20000)));
    let isOutput = await isOutputPresent(browser, page, user);
    assert.ok(isOutput);
}


async function isOutputPresent(browser, page, user){
    if(!isUserEmailValid(user)){
        try{
            await page.$eval('#name', '#email', '#currentAddress', '#permanentAddress', el => el.textContent );
            return false;
        }catch(Error){
           return true;
        }
    }
    if(user.userName!=""){
        const name = await page.$eval('#name', el => el.textContent );
        if(!name.includes(user.userName))
            return false;
    }
    if(user.userEmail!=""){
        const email = await page.$eval('#email', el => el.textContent );
        
        console.log("includes "+email.includes(user.userEmail))

        if(!email.includes(user.userEmail))
            return false;
    }
    if(user.currentAddress!=""){
        const currentAddress = await page.$eval('#currentAddress', el => el.value );
        
        console.log("includes "+currentAddress.includes(user.currentAddress))

        if(!currentAddress.includes(user.currentAddress))
            return false;
    }
    if(user.permanentAddress!=""){
        const permanentAddress = await page.$eval('#permanentAddress', el => el.value );
        
        console.log("includes "+permanentAddress.includes(user.permanentAddress))

        if(!permanentAddress.includes(user.permanentAddress))
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

function isUserEmailValid(user){
    return user.userEmail.includes('@');
}
async function clearAll(browser, page){
    await clearInput(browser, page,'#userName');
    await clearInput(browser, page, '#userEmail');
    await clearInput(browser, page, '#currentAddress');
    await clearInput(browser, page, '#permanentAddress');
    await page.click('#submit');
}
async function clearInput(browser, page, selector){
    const inputValue = await page.$eval(selector, el => el.value);
    await page.click(selector);
    for (let i = 0; i < inputValue.length; i++) {
    await page.keyboard.press('Backspace');
    }
}
