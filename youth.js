const { chromium } = require('playwright')
const fs = require('fs')
async function init(){
    const browser = await chromium.launch({
        headless: false,
    })
    const context = await browser.newContext({ acceptDownloads: true })
    const page = await context.newPage()
    const arr = []
    await page.goto('http://youngmanpizza.co.kr/sub01/menu2.php')
    await page.waitForLoadState('networkidle')

    const list = await page.$$('ul.menu_list>li')
    console.log(list.length)
    const length = list.length
    for(let i = 0; i<length; i++){
        await page.locator('ul.menu_list>li').nth(i).click()
        await page.waitForLoadState('networkidle') 
        arr.push(await getToppings(page))
        await page.goBack()
    }
    fs.appendFileSync('youth.json', JSON.stringify(arr))
    
    browser.close()
}

async function getToppings(page){
    const obj = {}
    obj.brand = '청년피자'
    obj.pizza_name = await page.innerText('div.info_title>p')
    obj.short_info = await page.innerText('div.info_sub_title>p')
    obj.price = await page.innerText('ul.info_price>li:first-child>p.price')
   
    // console.log(await price.$('p:nth-child(2)'))
obj.calorie =await page.innerText('#menu > section > div.detail_sec3 > div.sec3_table > table > tbody > tr:nth-child(2) > td:nth-child(6)') * 6
const toppings = await page.innerText('#menu > section > div.detail_top > div.detail_info > div.info_opt.topping > div > div > p')
 obj.topping = toppings.split(',')
    return obj
}
init().then().catch()