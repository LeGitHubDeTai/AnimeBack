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
var Jimp = require('jimp');
const nconf = require('nconf');
var logger = require('perfect-logger');
logger.initialize('log', {
    logLevelFile: 0,
    logLevelConsole: -1,
    logDirectory: 'logs/',
    customBannerHeaders: 'Tai Studio'
});

var config = `./log/colorsFile.json`;
nconf.file(config);

const testFolder = './log/preview';

var allBlack = [],
    allOther = [];

var temp = [];
var files = getFiles(testFolder);
function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        if(dir != `${testFolder}/animals/Categories.json`){
            if(dir != `${testFolder}/generator`){ //remove
                if(dir != `${testFolder}/interactive`){
                    var name = dir + '/' + files[i];
                    if (fs.statSync(name).isDirectory()){
                        getFiles(name, files_);
                        temp = [];
                    } else {
                        files_.push(name);
                        getColor(name);
                    }
                }
            }
        }
    }
    return files_;
}

function getColor(file){
    if(file.lastIndexOf("data.txt")){
        var black = 0,
            other = 0;
        Jimp.read(file, (err, image) => {
            if (err) console.log(err);
            try {
                for(y=0;y<image.getHeight();y++){
                    for(x=0;x<image.getWidth();x++){
                        var t = image.getPixelColor(x, y);
                        
                        switch(t){
                            case 255://BLACK
                                black++;
                                break;
                            case 4294967295://WHITE
                                black++;
                                break;
                            default:
                                other++;
                        }
                        logger.info(`Int: ${t}; Black: ${black}; Other: ${other}; File: ${file};`);
                        // console.log(`Int: ${t}; Black: ${black}; Other: ${other}; File: ${file};`);
                    }
                }
            } catch (error) {
                console.log(error);
            }
            finally{
                if(black > other){
                    console.log('Black Image !'.red);
                    allBlack.push(file.replace('./log', './images'));
                    nconf.set('Black', allBlack);
                    nconf.save();
                }
                else{
                    console.log('Best Image !'.green);
                    fs.unlinkSync(file);
                    allOther.push(file.replace('./log', './images'));
                    nconf.set('Other', allOther);
                    nconf.save();
                }
            }
        });
    }
}