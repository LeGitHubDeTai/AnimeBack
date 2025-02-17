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
const rimraf = require('rimraf');
const nconf = require('nconf');
var gifFrames = require('gif-frames');
var Jimp = require('jimp');
const testFolder = './images';
var config = `${testFolder}/categories.json`;

var tempBuf = 0;

if(fs.existsSync('./log/colorsFile.json')){
    var old = require('../log/colorsFile.json');
}else{
    var old = {"Detect":[], "Black":[],"Other":[]};
}

nconf.file(config);

if(!fs.existsSync(`${testFolder}/preview`)){
    fs.mkdirSync(`${testFolder}/preview`);
}

try {
    Object.keys(nconf.stores).forEach(function(name){
        Object.keys(nconf.stores[name].store).forEach(function(test){
            if(!fs.existsSync(`${testFolder}/preview/${test}`)){
                fs.mkdirSync(`${testFolder}/preview/${test}`);
            }
            if(test == "interactive"){
                for(i=0;i<nconf.get(`${test}`).length;i++){
                    var count = nconf.get(`${test}:${i}`).length;
                    var fileName = nconf.get(`${test}:${i}`);
                    
                    if(!fs.existsSync(`${testFolder}/preview/${test}/${fileName}`)){
                        fs.mkdirSync(`${testFolder}/preview/${test}/${fileName}`);
                        
                        if(fs.existsSync(`${testFolder}/${test}/${fileName}/Main.json`)){
                            let file = require(`.${testFolder}/${test}/${fileName}/Main.json`);
                            switch(file.type){
                                case ".mp4":
                                    extractMp4(test, `${fileName}/${file.preview.replace('.png', '')}`, 'mp4');
                                    break;
                                default:
                                    if(fs.existsSync(`${testFolder}/${test}/${fileName}/${file.preview}`)){
                                        fs.copyFileSync(`${testFolder}/${test}/${fileName}/${file.preview}`, `${testFolder}/preview/${test}/${fileName}/${file.preview}`);
                                    }
                            }
                        }
                        else{
                            console.log(`ERROR: ${testFolder}/${test}/${fileName}/Main.json NOT FOUND`.red);
                        }
                    }
                }
                return;
            }
            for(i=0;i<nconf.get(`${test}`).length;i++){
                var count = nconf.get(`${test}:${i}`).length;
                switch(nconf.get(`${test}:${i}`).slice(count - 3, count)){
                    case "mp4":
                        var fileName = nconf.get(`${test}:${i}`).slice(0, count - 4);
                        if(!fs.existsSync(`${testFolder}/preview/${test}/${fileName}.png`) || old["Black"].includes(`${testFolder}/preview/${test}/${fileName}.png`)){
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
                        if(!fs.existsSync(`${testFolder}/preview/${test}/${fileName}.png`) || old["Black"].includes(`${testFolder}/preview/${test}/${fileName}.png`)){
                            extractMp4(test, fileName, 'webm');
                        }
                        break;
                    case "png":
                        var fileName = nconf.get(`${test}:${i}`);
                        if(!fs.existsSync(`${testFolder}/preview/${test}/${fileName}.png`)){
                            fs.copyFileSync(`${testFolder}/${test}/${fileName}`, `${testFolder}/preview/${test}/${fileName}`);
                        }
                        break;
                    case "jpg":
                        var fileName = nconf.get(`${test}:${i}`).slice(0, count - 4);
                        if(!fs.existsSync(`${testFolder}/preview/${test}/${fileName}.png`)){
                            convertJPGtoPNG(`${testFolder}/${test}/${fileName}`, test, fileName);
                        }
                        break;
                    default:
                        var fileName = nconf.get(`${test}:${i}`);
                        console.log(`Error: ${testFolder}/${test}/${fileName}`);
                }
            }
        })
    });
} catch (error) {
    console.log(error);
}
finally{
    console.log('Done!'.green);
}

function extractMp4(test, fileName, ext){
    if(tempBuf > 25){return;}
    tempBuf++;
    if(!old["Black"].includes(`${testFolder}/preview/${test}/${fileName}.png`)){
        extractFrames({input: `${testFolder}/${test}/${fileName}.${ext}`, output: `${testFolder}/preview/${test}/${fileName}.png`,offsets: [1]});
        old["Black"].filter((id) => id !== `${testFolder}/preview/${test}/${fileName}.png`);

        var data = {
            "Detect": old["Detect"],
            "Black": old["Black"],
            "Other": old["Other"]
        }
        fs.writeFileSync('./log/colorsFile.json', JSON.stringify(data), (err) => {
            console.log(err);
        });
    }else{
        extractFrames({input: `${testFolder}/${test}/${fileName}.${ext}`, output: `${testFolder}/preview/${test}/${fileName}.png`,offsets: [1000]});
    }
    console.log(`INFO: ${testFolder}/${test}/${fileName}.${ext}`.cyan);
}
function extractGif(test, fileName){
    gifFrames({ url: test, frames: 0, outputType: 'png' }).then(function (frameData) {
        frameData[0].getImage().pipe(fs.createWriteStream(fileName));
    });
    console.log(`INFO: ${test}`.cyan);
}

function convertJPGtoPNG(file, test, fileName){
    Jimp.read(`${file}.jpg`)
    .then(image => {
        console.log(`INFO: ${file}`.cyan);
        return image.write(`${testFolder}/preview/${test}/${fileName}.png`);
    })
    .catch(err => {
        console.error(err);
        console.log(`ERROR: ${file}`.red);
    });
}