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

var config = `./log/colorsFile.json`;
nconf.file(config);

const testFolder = './images/preview';

var files = getFiles(testFolder);
function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        if(dir != `${testFolder}/animals/Categories.json`){
            if(dir != `${testFolder}/generator`){ //remove
                if(dir != `${testFolder}/interactive`){
                    if(files[i].slice(files[i].length - 5, files[i].length) != '.json'){
                        var name = dir + '/' + files[i];
                        if (fs.statSync(name).isDirectory()){
                            getFiles(name, files_);
                        } else {
                            files_.push(name);
                            if(!fs.existsSync(`${name}.json`)){
                                getBase64(name);
                            }
                        }
                    }
                }
            }
        }
    }
    return files_;
}

function getBase64(file){
    Jimp.read(file, (err, image) => {
        if (err) console.log(err);
        image.getBase64(Jimp.MIME_PNG, (err, val) => {
            fs.writeFileSync(`${file}.json`, val);
            console.log('Done !'.green);
        });
    });
}
