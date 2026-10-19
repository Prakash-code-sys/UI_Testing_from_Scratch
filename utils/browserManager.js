import { chromium,firefox,webkit } from "@playwright";

export class Browsermanager{

    static async launchBrowser(browser="chromium"){
        const availableBrowsers= {chromium,firefox,webkit}
        const selectedBrowser= availableBrowsers[browser]

        const isChromium= selectedBrowser==="chromium"
        const headless= process.env.headless !== 'false'
        const launchargs= []
        if(isChromium){
            launchargs.push('--start-maximized')
        }

        const browser= await selectedBrowser.launch({
            headless,
            args:launchargs
        })
        const context= await browser.newContext({
            viewport:null,
            recordVideo:{dir:'Videos'}
        })
        const page= await context.newPage()

        return {
                browser:browser,
                context:context,
                page:page
               }

    }

}