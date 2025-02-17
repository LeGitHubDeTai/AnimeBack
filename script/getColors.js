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
var Jimp = require('jimp');
const nconf = require('nconf');

var config = `./log/colorsFile.json`;
nconf.file(config);

const testFolder = './log/preview';

var allBlack = nconf.get('Black') || [],
    allOther = nconf.get('Other') || [],
    allDetect = nconf.get('Detect') || [];

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
                    if(y == image.getHeight() && x == image.getWidth()){
                        console.log(`Int: ${t}; Black: ${black}; Other: ${other}; File: ${file};`);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
        finally{
            var fileN = file.replace('./log', './images');
            if(black > other){
                console.log(`ERROR:`.red, `${file}`.cyan, "It's".gray, 'Black Image !'.red);
                if(!allBlack.includes(fileN)){
                    if(!allOther.includes(fileN)){
                        if(!allDetect.includes(fileN)){
                            allBlack.push(fileN);
                        }
                    }
                    else{
                        fs.unlinkSync(file);
                    }
                }
                else{
                    if(!allDetect.includes(fileN)){
                        allBlack = allBlack.filter((id) => id === fileN);
                        allDetect.push(fileN);
                    }
                }
            }
            else{
                console.log(`INFO: ${file}`.cyan, "It's".gray, 'Best Image !'.green);
                fs.unlinkSync(file);
                if (!allOther.includes(fileN)){
                    if(allBlack.includes(fileN)){
                        allBlack = allBlack.filter((id) => id === fileN);
                    }
                    allOther.push(fileN);
                }
            }
            nconf.set('Other', allOther);
            nconf.set('Black', allBlack);
            nconf.set('Detect', allDetect);
            nconf.save();
        }
    });
}
