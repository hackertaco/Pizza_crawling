const { chromium } = require('playwright')
const fs = require('fs')

async function init(){
    const browser = await chromium.launch({
        headless: false,
    })
    const context = await browser.newContext({ acceptDownloads: true })
    const page = await context.newPage()
    const arr = []
    await page.goto('http://www.eurokopizza.kr/theme/s007/index/pizza_01.php?sca=%EC%8B%9C%EA%B7%B8%EB%8B%88%EC%B2%98')
    await page.waitForLoadState('networkidle')

    const list = await page.$$('ul.list-unstyled>a')
    console.log(list.length)
    const length = list.length
    for(let i = 0; i<length; i++){
        await page.locator('ul.list-unstyled').nth(i).locator('li').nth(i).click()
        // console.log(a.length)
        await page.waitForLoadState('networkidle') 
        arr.push(await getToppings(page))
        await page.goBack()
    }
    fs.appendFileSync('euroko.json', JSON.stringify(arr))
    
    browser.close()
}

async function getToppings(page){
    const obj = {}
    obj.brand = '유로코피자'
    obj.pizza_name = await page.innerText('h2')
    obj.short_info = await page.innerText('div.name_box>p')
    obj.price = await page.innerText('ul.n_list>li:first-child')
    console.log(obj.price.length)
}

init()