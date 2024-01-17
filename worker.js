
async function fillForm(browser, page, user) {
    await page.type('#userName', user.userName);
    await page.type('#userEmail', user.userEmail);
    await page.type('#currentAddress', user.currentAddress);
    await page.type('#permanentAddress', user.permanentAddress);

    await page.click('#submit');
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
        
        if(!email.includes(user.userEmail))
            return false;
    }
    if(user.currentAddress!=""){
        const currentAddress = await page.$eval('#currentAddress', el => el.value );
        
        if(!currentAddress.includes(user.currentAddress))
            return false;
    }
    if(user.permanentAddress!=""){
        const permanentAddress = await page.$eval('#permanentAddress', el => el.value );

        if(!permanentAddress.includes(user.permanentAddress))
            return false;
    }
    return true;
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


module.exports.fillForm = fillForm;
module.exports.isOutputPresent = isOutputPresent;
module.exports.getRndInteger = getRndInteger;
module.exports.isUserEmailValid = isUserEmailValid;
module.exports.clearAll = clearAll;