import {Before,After,Status} from '@cucumber/cucumber'

import { Browsermanager } from '../utils/browserManager'
import fs from 'node:fs'
Before(async function() {
    
    const browserName= 'chromium'
    const browserDetails= await Browsermanager.launchBrowser(browserName)
    this.browser= browserDetails.browser
    this.context= browserDetails.context
    this.page= browserDetails.page

})

After(async function(Scenario){
    if(Scenario.result.status===Status.FAILED){
        const screenshotPath= `screen/${Date.now}.png`
        await this.page.screenshot({path:screenshotPath,fullPage:true})
        const screens= fs.readFileSync(screenshotPath)
        await this.attach(screens,'image.png')                      //
    }

    await this.page.close()
    await this.context.close()
    await this.browser.close()


})