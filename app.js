var easyinvoice = require('easyinvoice');
var fs = require('fs-extra');
// const fs = require("fs-extra");
const path = require("path");
const puppeteer = require('puppeteer');
const hbs = require("handlebars");
const moment  = require('moment');
const getInformation=require('./fetch_fire_store_data').getInformation;


const {createAndUploadFile,auth}=require('./uploadToDrive');

const compile = async function(data){
  const invoicePath = path.resolve("./receipt.html");
  const html = await fs.readFile(invoicePath,'utf-8');
  return hbs.compile(html)(data);
}
hbs.registerHelper('dataFormate',function(value,formate){
  console.log('formating',value,formate);
  return  moment(value).formate(formate);
})

getInformation().then((res)=>{
  console.log(res);
    
    
        writePdf(res).then((ele)=>{
          console.log(ele);
          createAndUploadFile(auth).then(url=>{
            console.log(url);
        })
    });
})

const writePdf = (data)=>{
  return new Promise(async (resolve,reject)=>{
    try{
      const browser = await puppeteer.launch();
      const page =  await browser.newPage();
  
      const content = await compile(data); 
  
      await page.setContent(content);
      await page.emulateMediaType('screen');
      await page.pdf({
          path:'receipt.pdf',
          formate:'A4',
          pageRanges:'1'
      });
      console.log("done");
      await browser.close();
      resolve("true");
    }
    catch(e){
        console.log(e);
        reject("false");
    }
  });
}



