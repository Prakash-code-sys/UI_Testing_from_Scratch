import {test,expect} from '@playwright/test'
//import { test, expect } from '../../fixtures/fixture.js';
import fs from 'node:fs/promises'
import path from 'node:path'

test('1.Form filling',{tag:['@formFill']},async({page})=>{

    //Go to URL
    await page.goto(process.env.BASE_URL)
   
    //Name
    const name= await page.locator('#name')
    await name.fill("prakash")
    await expect(name).toHaveValue("prakash")
    //Email
    const email= await page.locator('#email')
    await email.fill("prakash@gmail.com")
    await expect(email).toHaveValue("prakash@gmail.com")

    //Phone
    const phone= await page.locator('#phone')
    await phone.fill("63699")
    await expect(phone).toHaveValue("63699")

    //Address
    const address= await page.locator('#textarea')
    await address.fill("West Street")
    await expect(address).toHaveValue("West Street")
   
    /* Learnings dotenv need to add in playwright.config.js thats enough*/

})

test('2.Radio Buttons',{tag:['@radioButton']},async({page})=>{

    //Go to URL
    await page.goto(process.env.BASE_URL)

    //male radio Button
    const male= page.locator('#male')
    await male.check()
    await expect(male).toBeChecked()

    //Female radio Button
    const female= page.locator('#female')
    await female.check()
    await expect(female).toBeChecked()

})

test('3.Check Boxes',{tag:['@checkBox']},async({page})=>{
    //Go to URL
    await page.goto(process.env.BASE_URL)
    
    //locators for days
    const monday= page.locator('#monday')
    const thursday= page.locator('#thursday')
    const friday= page.locator('#friday')
    const saturday= page.locator('#saturday')
    
    //check method
    await monday.check()
    await thursday.check()
    await friday.check()

    //assertions
    await expect(monday).toBeChecked()
    await expect(thursday).toBeChecked()
    await expect(friday).toBeChecked()
    //negative assertions
    await expect(saturday).not.toBeChecked()
})

test('4.Drop down',{tag:['@dropDown']},async({page})=>{
    
    //Go to URL
    await page.goto(process.env.BASE_URL)
    
    //county selection- Single Drop down
    const country= page.locator('#country')
    await country.selectOption({value:"usa"})
    await expect(country).toHaveValue('usa')
    await expect(page.locator('#country option')).toHaveCount(10)
    
    //Color selection - Multi drop down
    const colour= page.locator('#colors')
    await colour.selectOption(["Red","Blue","Green"])
    await expect(colour).toHaveValues(["red","blue","green"]) //note: in assertions value only need to validate not text
    await expect(page.locator('#colors option')).toHaveCount(7)

    //scrollIntoViewIfNeeded
    const animal= page.locator('#animals')
    await animal.scrollIntoViewIfNeeded()
    await animal.selectOption(['Cat','Elephant','Zebra'])
    //assertions
    await expect(animal).toHaveValues(['cat','elephant','zebra'])
    await expect(page.locator('#animals option')).toHaveCount(10)
    await page.waitForTimeout(3000)
    
});

test('5.upload files',{tag:['@uploadFiles']},async({page})=>{
    //Go to URL
    await page.goto(process.env.BASE_URL)
    
    //singleFile upload
    const singleFile= page.locator('#singleFileInput')
    await singleFile.setInputFiles('upload1.txt')
    await expect(singleFile).toHaveValue(/upload1\.txt/)
    const upload= page.getByText('Upload Single File')
    await upload.click()
    
    //multiplefile upload
    const multiFile= page.locator('#multipleFilesInput')
    await multiFile.setInputFiles(['upload1.txt','upload2.txt'])
    await expect(multiFile).toHaveValue(/upload1\.txt/,/upload2\.txt/)
    const upload1= page.getByText('Upload Multiple Files')
    await upload1.click()
    await page.waitForTimeout(3000)
    
})

test('6.drag&drop',{tag:['@dragTo']},async({page})=>{
    //Go to URL
    await page.goto(process.env.BASE_URL)
    //drag and drop
    await page.locator('#draggable').dragTo(page.locator('#droppable'))
    await page.waitForTimeout(3000)
})

test('7.Alerts & Popups',{tag:['@alerts']},async({page})=>{
    //Go to URL
    await page.goto(process.env.BASE_URL)

    page.on('dialog',async dialog=>{

        if(dialog.type()==='alert'){
          console.log(dialog.message())
          console.log(dialog.type())
          await dialog.accept()  
         }else if(dialog.type()==='confirm'){
          console.log(dialog.message())
          console.log(dialog.type())
          await dialog.dismiss()  
          

        }else if(dialog.type()==='prompt'){
            console.log(dialog.message())
          console.log(dialog.type())
          await dialog.accept('Prakash')
        }
        
    })
    
    await page.locator('#alertBtn').click()
    await page.locator('#confirmBtn').click()
    await page.locator('#promptBtn').click()
    
})

test('8.Mouse actions',{tag:['@mouse']},async({page})=>{
    //Go to URL
    await page.goto(process.env.BASE_URL)
    //hover
    const hover=page.getByText('Point Me')
    await hover.hover()
    //dblClick
    const dblClick= page.getByText('Copy Text')
    await dblClick.dblclick()
    //right click
    const home= page.getByRole('link',{name:'Home'}).nth(0)
    await home.click({button:'right'})
    
    //scroll
    await page.mouse.wheel(0,1000)
    await page.mouse.wheel(0,-1000)
    await page.waitForTimeout(3000)
})

test('9.Robot class_Keyboard',{tag:['@keyboard']},async({page})=>{
    //Go to URL
    await page.goto(process.env.BASE_URL)

    //right click
    const home= page.getByRole('link',{name:'Home'}).nth(0)
    await home.click({button:'right'})

    for(let i=0;i<2;i++){
        await page.keyboard.press('ArrowDown')
        
    }
    await page.keyboard.press('Enter')
    await page.waitForTimeout(3000)


})

test('10.screenshot',{tag:['@screenshot']},async({page})=>{
    //Go to URL
    await page.goto(process.env.BASE_URL)

    async function getScreenshot(page,name){
        await page.screenshot({path:`screenshots/${name}.png`,fullPage:true})
    }

    await page.locator('#name').fill("prakash")
    await getScreenshot(page,'Homepage')

});

test('11.Window handling',{tag:['@window_handling']},async({page,context})=>{
     //Go to URL
    await page.goto(process.env.BASE_URL)
   
    //capture new window correctly
    const [newTab]= await Promise.all([
        context.waitForEvent('page'),
        page.getByText('New Tab').click()
    ]);

    //context
    const pages= context.pages();
    const count = pages.length
    console.log(count)
    
    //window separation
    const homeWindow= pages[0]
    const childWindow= pages[1]
   
    //for multiple tab
    await childWindow.getByText('Advanced Java').click()
    await homeWindow.getByText('Home').nth(0).click({button:'right'})
    await page.waitForTimeout(3000)

    //for one tab
    await newTab.getByText('Mock Interviews').click()
    


})

test('12.Web table',{tag:["@webTable"]},async({page})=>{
    
    //funtion for clicking particular product
    async function selectProduct(rows,page,product){
        const selectedRow= await rows.filter({
        has:page.locator('td'),
        hasText:product
        })
   
        await selectedRow.locator('//input').click()
    }
    //Go to URL
    await page.goto(process.env.BASE_URL)
    //capture table
    const table = page.locator('#productTable')
    //capture table's rows
    const rows= table.locator('tbody tr')
    //capture table's columns
    const columns= table.locator('thead tr th')
    //total rows and columns
    console.log('Number of rows:',await rows.count())
    console.log('Number of columns',await columns.count())

    await selectProduct(rows,page,"Laptop") //function calling
    await page.waitForTimeout(3000)

    const pages= page.locator('#pagination li a')
    console.log('Number of Pages',await pages.count())

    for(let p=0;p<await pages.count();p++){
        if(p>0){
            await pages.nth(p).click()
        }
        for(let r=0; r<await rows.count();r++){
            const row= rows.nth(r)
            const tds= row.locator('td')
            //select product
            const rowText= await rows.nth(r).innerText()

            //console.log(typeof rowText, rowText);
            if(rowText.includes("Soundbar")){
                await row.locator('//input').check()
                await page.waitForTimeout(3000)
            }
           for(let d=0;d<await tds.count()-1;d++){
              const data= await tds.nth(d).textContent()
              console.log(data)
        }
    }
    }
})


test('13.Download',{tag:['@download']},async({page})=>{

    //Go to URL
    await page.goto(process.env.BASE_URL)
    const downloadDir= path.resolve('downloads')
    await fs.mkdir(downloadDir,{recursive:true})

    await page.getByText('Download Files').click()
    
    const [download]= await Promise.all([
        page.waitForEvent('download'),
        page.getByText('Download PDF File').nth(2).click()


    ])
    const save = await page.locator('#save').click()
    await save.saveAs(path.join(downloadDir,'name.txt'))


});

test('14.FrameLocator',{tag:['@frames']},async({page})=>{

    await page.goto('https://www.playwrightautomation.com/practice.html?utm_source=chatgpt.com#section-frame-counting')
    
    const frames=page.frames()
    console.log(frames.length)

    const data= await page.locator('#travel-dashboard').frameLocator('#frame-flight-status')
    const date= await data.locator('.wh').innerText()
    console.log(date)

})

test('15.Invlaid links',{tag:['@invalid']},async({page})=>{
    //Go to URL
    await page.goto(process.env.BASE_URL)

    const links = page.locator('a')
    const total_links= await links.count()

    for(let i=0;i<await links.count();i++){
         const href= await links.nth(i).getAttribute('href')
         if(href){
            const url= new URL(href,page.url()).href;
            try {
                const response= await page.request.get(url);
                const status= response.status()
                if(status>=400){
                    console.log('broken link',url,'status :',status)
                }else{
                    console.log('Active :',url,'status:',status)
                }

            } catch(error) {
                console.log(error.message())
            }
         }

    }
})