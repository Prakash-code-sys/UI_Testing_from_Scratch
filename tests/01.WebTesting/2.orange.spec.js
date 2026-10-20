import {test,expect} from '@playwright/test'

test('as',{tag:['@api']},async({page,context})=>{

    // await page.route(`**/core/i18n/messages`,async route=>{

    //     await route.fulfill({
    //         status:304,
    //     })
    // })
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')

    const cookies = await context.cookies();
    console.log(cookies);
})