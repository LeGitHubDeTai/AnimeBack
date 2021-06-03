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
const fs = require('fs');
const path = require('path');
const nconf = require('nconf');
var Jimp = require('jimp');
const testFolder = './images';
var config = `${testFolder}/categories.json`;

nconf.file(config);

Object.keys(nconf.stores).forEach(function(name){
    Object.keys(nconf.stores[name].store).forEach(function(test){
        for(i=0;i<nconf.get(`${test}`).length;i++){
            var count = nconf.get(`${test}:${i}`).length;
            if(nconf.get(`${test}:${i}`).slice(count - 3, count) == "mp4"){
                var fileName = nconf.get(`${test}:${i}`).slice(0, count - 4);
                if(fs.existsSync(`${testFolder}/preview/${test}/${fileName}.png`)){
                    resize(`${testFolder}/preview/${test}/${fileName}.png`);
                }
            }
        }
    })
});

console.log('Done!'.green);

function resize(file){
    if(file.lastIndexOf('.webp')){return;}
    Jimp.read(file)
    .then(image => {
        if(image.getHeight() != 1080 && image.getWidth() != 1920){
            image.resize(1920, 1080)
            .write(file);
            console.log(`INFO: ${file}`.cyan, 'Resized !'.gray);
        }
    })
    .catch(err => {
        console.error(err);
        console.log(`ERROR: ${file}`.red);
    });
}