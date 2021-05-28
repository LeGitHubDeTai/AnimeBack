/*--------------------------------------------------------------------------------------\
|  _______    _    _____ _             _ _           ________     ___   ___ ___  __     |
| |__   __|  (_)  / ____| |           | (_)         /  ____  \   |__ \ / _ \__ \/_ |    |
|    | | __ _ _  | (___ | |_ _   _  __| |_  ___    /  / ___|  \     ) | | | | ) || |    |
|    | |/ _` | |  \___ \| __| | | |/ _` | |/ _ \  |  | |       |   / /| | | |/ / | |    |
|    | | (_| | |  ____) | |_| |_| | (_| | | (_) | |  | |___    |  / /_| |_| / /_ | |    |
|    |_|\__,_|_| |_____/ \__|\__,_|\__,_|_|\___/   \  \____|  /  |____|\___/____||_|    |
|                                                   \________/                          |
\--------------------------------------------------------------------------------------*/

var colors = require('colors');
const extractFrames = require('ffmpeg-extract-frames');
const fs = require('fs');
const path = require('path');
const nconf = require('nconf');
var Jimp = require('jimp');
const testFolder = './images';
var config = `${testFolder}/categories.json`;

nconf.file(config);

if(!fs.existsSync(`${testFolder}/preview`)){
    fs.mkdirSync(`${testFolder}/preview`);
}

Object.keys(nconf.stores).forEach(function(name){
    Object.keys(nconf.stores[name].store).forEach(function(test){
        if(test == "interactive"){return;}
        if(!fs.existsSync(`${testFolder}/preview/${test}`)){
            fs.mkdirSync(`${testFolder}/preview/${test}`);
        }
        for(i=0;i<nconf.get(`${test}`).length;i++){
            var count = nconf.get(`${test}:${i}`).length;
            if(nconf.get(`${test}:${i}`).slice(count - 3, count) === "mp4"){
                var fileName = nconf.get(`${test}:${i}`).slice(0, count - 4);
                if(!fs.existsSync(`${testFolder}/preview/${test}/${fileName}.png`)){
                    extractFrames({input: `${testFolder}/${test}/${fileName}.mp4`, output: `${testFolder}/preview/${test}/${fileName}.png`,offsets: [6]});
                }
            }
            if(nconf.get(`${test}:${i}`).slice(count - 3, count) === "gif"){
                var fileName = nconf.get(`${test}:${i}`).slice(0, count - 4);
                if(!fs.existsSync(`${testFolder}/preview/${test}/${fileName}.png`)){
                    Jimp.read(`${testFolder}/${test}/${fileName}.gif`)
                    .then(image => {
                        return image
                        .resize(1920, 1080)
                        .write(`${testFolder}/preview/${test}/${fileName}.png`);
                    })
                    .catch(err => {
                        console.error(err);
                    });
                }
            }
            // switch(nconf.get(`${test}:${i}`).slice(count - 3, count)){
            //     case "mp4":
            //         var fileName = nconf.get(`${test}:${i}`).slice(0, count - 4);
            //         if(!fs.existsSync(`${testFolder}/preview/${test}/${fileName}.png`)){
            //             extractFrames({input: `${testFolder}/${test}/${fileName}.mp4`, output: `${testFolder}/preview/${test}/${fileName}.png`,offsets: [1]});
            //         }
            //         break;
            //     case "gif":
            //         var fileName = nconf.get(`${test}:${i}`).slice(0, count - 4);
            //         if(!fs.existsSync(`${testFolder}/preview/${test}/${fileName}.png`)){
            //             Jimp.read(`${testFolder}/${test}/${fileName}.gif`)
            //             .then(image => {
            //                 return image
            //                 .resize(1920, 1080)
            //                 .write(`${testFolder}/preview/${test}/${fileName}.png`);
            //             })
            //             .catch(err => {
            //                 console.error(err);
            //             });
            //         }
            //         break;
            //     case "ebm":
            //         var fileName = nconf.get(`${test}:${i}`).slice(0, count - 5);
            //         if(!fs.existsSync(`${testFolder}/preview/${test}/${fileName}.png`)){
            //             Jimp.read(`${testFolder}/${test}/${fileName}.webm`)
            //             .then(image => {
            //                 return image
            //                 .resize(1920, 1080)
            //                 .write(`${testFolder}/preview/${test}/${fileName}.png`);
            //             })
            //             .catch(err => {
            //                 console.error(err);
            //             });
            //         }
            //         break;
            //     case "png":
            //         var fileName = nconf.get(`${test}:${i}`);
            //         fs.copyFileSync(`${testFolder}/${test}/${fileName}`, `${testFolder}/preview/${test}/${fileName}`)
            //         break;
            //     case "jpg":
            //         var fileName = nconf.get(`${test}:${i}`);
            //         fs.copyFileSync(`${testFolder}/${test}/${fileName}`, `${testFolder}/preview/${test}/${fileName}`)
            //         break;
            //     default:
            //         var fileName = nconf.get(`${test}:${i}`);
            //         console.log(`Error: ${testFolder}/${test}/${fileName}`);
            // }
        }
    })
});

console.log('Done!'.green);