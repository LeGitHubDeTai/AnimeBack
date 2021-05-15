/*--------------------------------------------------------------------------------------\
|  _______    _    _____ _             _ _           ________     ___   ___ ___  __     |
| |__   __|  (_)  / ____| |           | (_)         /  ____  \   |__ \ / _ \__ \/_ |    |
|    | | __ _ _  | (___ | |_ _   _  __| |_  ___    /  / ___|  \     ) | | | | ) || |    |
|    | |/ _` | |  \___ \| __| | | |/ _` | |/ _ \  |  | |       |   / /| | | |/ / | |    |
|    | | (_| | |  ____) | |_| |_| | (_| | | (_) | |  | |___    |  / /_| |_| / /_ | |    |
|    |_|\__,_|_| |_____/ \__|\__,_|\__,_|_|\___/   \  \____|  /  |____|\___/____||_|    |
|                                                   \________/                          |
\--------------------------------------------------------------------------------------*/

const extractFrames = require('ffmpeg-extract-frames');
const fs = require('fs');
const nconf = require('nconf');
const testFolder = './images';
var config = `${testFolder}/categories.json`;

nconf.file(config);

Object.keys(nconf.stores).forEach(function(name){
    Object.keys(nconf.stores[name].store).forEach(function(test){
        for(i=0;i<nconf.get(`${test}`).length;i++){
            var count = nconf.get(`${test}:${i}`).length;
            if(nconf.get(`${test}:${i}`).slice(count - 3, count) == "mp4"){
                var fileName = nconf.get(`${test}:${i}`).slice(0, count - 4);
                if(!fs.existsSync(`${testFolder}/preview/${test}/${fileName}.png`)){
                    extractFrames({input: `${testFolder}/${test}/${fileName}.mp4`, output: `${testFolder}/preview/${test}/${fileName}.png`,offsets: [1]});
                }
            }
        }
    })
});

console.log('Done!');