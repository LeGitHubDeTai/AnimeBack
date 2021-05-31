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
const nconf = require('nconf');
var gifFrames = require('gif-frames');
const testFolder = './images';
var config = `${testFolder}/categories.json`;

var tempBuf = 0;
var old = require('../log/colorsFile.json');

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
            switch(nconf.get(`${test}:${i}`).slice(count - 3, count)){
                case "mp4":
                    var fileName = nconf.get(`${test}:${i}`).slice(0, count - 4);
                    if(!fs.existsSync(`${testFolder}/preview/${test}/${fileName}.png`)){
                        extractMp4(test, fileName, 'mp4');
                    }
                    break;
                case "gif":
                    var fileName = nconf.get(`${test}:${i}`).slice(0, count - 4);
                    if(!fs.existsSync(`${testFolder}/preview/${test}/${fileName}.png`)){
                        var src = `${testFolder}/${test}/${fileName}.gif`,
                            dest = `${testFolder}/preview/${test}/${fileName}.png`;
                        extractGif(src, dest);
                    }
                    break;
                case "ebm":
                    var fileName = nconf.get(`${test}:${i}`).slice(0, count - 5);
                    if(!fs.existsSync(`${testFolder}/preview/${test}/${fileName}.png`)){
                        extractMp4(test, fileName, 'webm');
                    }
                    break;
                case "png":
                    var fileName = nconf.get(`${test}:${i}`);
                    fs.copyFileSync(`${testFolder}/${test}/${fileName}`, `${testFolder}/preview/${test}/${fileName}`)
                    break;
                case "jpg":
                    var fileName = nconf.get(`${test}:${i}`);
                    fs.copyFileSync(`${testFolder}/${test}/${fileName}`, `${testFolder}/preview/${test}/${fileName}`)
                    break;
                default:
                    var fileName = nconf.get(`${test}:${i}`);
                    console.log(`Error: ${testFolder}/${test}/${fileName}`);
            }
        }
    })
});

console.log('Done!'.green);

function extractMp4(test, fileName, ext){
    if(tempBuf > 150){return;}
    tempBuf++;
    if(old["Black"].includes(`${testFolder}/preview/${test}/${fileName}.png`)){
        extractFrames({input: `${testFolder}/${test}/${fileName}.${ext}`, output: `${testFolder}/preview/${test}/${fileName}.png`,offsets: [1]});
        old["Black"].filter((id) => id !== `${testFolder}/preview/${test}/${fileName}.png`);

        var data = {
            "Black": old["Black"],
            "Other": old["Other"]
        }
        fs.writeFileSync('./log/colorsFile.json', JSON.stringify(data), (err) => {
            console.log(err);
        });
    }else{
        extractFrames({input: `${testFolder}/${test}/${fileName}.${ext}`, output: `${testFolder}/preview/${test}/${fileName}.png`,offsets: [1000]});
    }
}
function extractGif(test, fileName){
    gifFrames({ url: test, frames: 0, outputType: 'png' }).then(function (frameData) {
        frameData[0].getImage().pipe(fs.createWriteStream(fileName));
    });
}
