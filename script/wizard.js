/*--------------------------------------------------------------------------------------\
|  _______    _    _____ _             _ _           ________     ___   ___ ___  __     |
| |__   __|  (_)  / ____| |           | (_)         /  ____  \   |__ \ / _ \__ \/_ |    |
|    | | __ _ _  | (___ | |_ _   _  __| |_  ___    /  / ___|  \     ) | | | | ) || |    |
|    | |/ _` | |  \___ \| __| | | |/ _` | |/ _ \  |  | |       |   / /| | | |/ / | |    |
|    | | (_| | |  ____) | |_| |_| | (_| | | (_) | |  | |___    |  / /_| |_| / /_ | |    |
|    |_|\__,_|_| |_____/ \__|\__,_|\__,_|_|\___/   \  \____|  /  |____|\___/____||_|    |
|                                                   \________/                          |
\--------------------------------------------------------------------------------------*/

const fs = require('fs');
const nconf = require('nconf');
const testFolder = './images';
var config = `${testFolder}/categories.json`;

if(fs.existsSync(config)){
    fs.unlinkSync(config);
}
nconf.file(config);
var temp = [];
function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        if(dir != `${testFolder}/preview`){
            if(dir != `${testFolder}/generator`){ //remove
                if(dir == `${testFolder}/interactive`){
                    var name = dir + '/' + files[i];
                    files_.push(name);
                    temp.push(files[i]);
                    nconf.set(`${dir.replace(`${testFolder}/`, '')}`, temp);
                }else{
                    var name = dir + '/' + files[i];
                    if (fs.statSync(name).isDirectory()){
                        getFiles(name, files_);
                        temp = [];
                    } else {
                        files_.push(name);
                        temp.push(files[i]);
                        nconf.set(`${dir.replace(`${testFolder}/`, '')}`, temp);
                    }
                }
            }
        }
    }
    return files_;
}
getFiles(testFolder);
nconf.clear('./images');
nconf.save();
console.log('Done!');