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
var gifFrames = require('gif-frames');
const testFolder = './images';
var config = `./log/colorsFile.json`;

nconf.file(config);

if(!fs.existsSync(`${testFolder}/preview`)){
    fs.mkdirSync(`${testFolder}/preview`);
}

Object.keys(nconf.stores).forEach(function(name){
    Object.keys(nconf.stores[name].store).forEach(function(test){
        if(test == "Other"){return console.log('Done !'.green);}

        console.log(nconf.get(`${test}`))

        for(i=0;i<nconf.get(`${test}`).length;i++){
            var count = nconf.get(`${test}:${i}`).length;

            nconf.get(`${test}:${i}`).replace('preview/', '').replace('.png', '.mp4');

            var fileName = nconf.get(`${test}:${i}`).replace(`${testFolder}/preview/${test}/`, '').replace('.png', '');
            if(fs.existsSync(`${testFolder}/preview/${test}/${fileName}.png`)){
                fs.unlinkSync(`${testFolder}/preview/${test}/${fileName}.png`)
                extractMp4(test, fileName, 'mp4');
            }
        }
    })
});

function extractMp4(test, fileName, ext){
    extractFrames({input: `${testFolder}/${test}/${fileName}.${ext}`, output: `${testFolder}/preview/${test}/${fileName}.png`,offsets: [1]});
}