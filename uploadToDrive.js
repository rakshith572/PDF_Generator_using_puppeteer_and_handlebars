const fs = require('fs')
const readline = require('readline');
const {google} = require('googleapis');
const { resolve } = require('path');

const keyFilePath = './googleApiKey.json';
const scopes = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
    keyFile:keyFilePath,
    scopes:['https://www.googleapis.com/auth/drive'],
})


// const {google} = require('googleapis');

const createAndUploadFile = async (auth)=>{
    return new Promise(async (resolve,reject)=>{
        const driveService = google.drive({version:'v3',auth});
        let fileMetaData = {
            name:'receipt.pdf',
            parents:['11d0MlzUeNJ8KdpXrOkrG_HcmGaTUaKEh'],
        }

        const media = {
            mimeType:'application/pdf',
            body:fs.createReadStream('./receipt.pdf'),
            
            // body:fs.createReadStream(result.pdf),
        }
        
        const response = await driveService.files.create({
            resource:fileMetaData,
            media:media,
            field:'id',
        })
        switch(response.status){
            case 200:
                    console.log('File Created id',response.data.id)
                    const url = `https://drive.google.com/file/d/`+response.data.id;
                    resolve(url);
                    break;
        }
    })
}

// createAndUploadFile(auth);
module.exports={
    createAndUploadFile,
    auth
}
