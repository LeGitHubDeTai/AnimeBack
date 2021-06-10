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
const testFolder = './images';
var config = `${testFolder}/categories.json`;

if(fs.existsSync('./log/colorsFile.json')){
    var old = require('../log/colorsFile.json');
}else{
    var old = {"Detect":[], "Black":[],"Other":[]};
}

if(fs.existsSync('./log/env.json')){
    var env = require('../log/env.json');
}else{
    var env = {"first": true};
}

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
            if(dir != `${testFolder}/Categories.json`){
                if(dir != `${testFolder}/animals/Categories.json`){
                    if(dir != `${testFolder}/generator`){ //remove
                        if(dir == `${testFolder}/interactive`){
                            var name = dir + '/' + files[i];
                            files_.push(name);
                            temp.push(files[i]);
                            nconf.set(`${replaceAll(dir, `${testFolder}/`, '')}`, temp);
                        }else{
                            var name = dir + '/' + files[i];
                            if (fs.statSync(name).isDirectory()){
                                getFiles(name, files_);
                                temp = [];
                            } else {
                                files_.push(name);
                                temp.push(files[i]);
                                
                                var count = files[i].length;
                                switch(files[i].slice(count - 3, count)){
                                    case "mp4":
                                        var preview = dir.replace(`${testFolder}`, `${testFolder}/preview`) + '/' + replaceAll(files[i], '.mp4', '.png');
                                        break;
                                    case "gif":
                                        var preview = dir.replace(`${testFolder}`, `${testFolder}/preview`) + '/' + replaceAll(files[i], '.gif', '.png');
                                        break;
                                    case "ebm":
                                        var preview = dir.replace(`${testFolder}`, `${testFolder}/preview`) + '/' + replaceAll(files[i], '.webm', '.png');
                                        break;
                                    case "png":
                                        var preview = dir.replace(`${testFolder}`, `${testFolder}/preview`) + '/' + replaceAll(files[i], '.png', '.png');
                                        break;
                                    case "jpg":
                                        var preview = dir.replace(`${testFolder}`, `${testFolder}/preview`) + '/' + replaceAll(files[i], '.jpg', '.png');
                                        break;
                                    default:
                                        var preview = dir.replace(`${testFolder}`, `${testFolder}/preview`) + '/' + replaceAll(files[i], files[i].slice(count - 3, count), '.png');
                                }

                                if(env.first == true){
                                    if(fs.existsSync(preview)){
                                        if(old.Black.includes(preview)){
                                            var Index = temp.indexOf(files[i]);
                                            temp.splice(Index, 1);
                                        }
                                        if(old.Detect.includes(preview)){
                                            var Index = temp.indexOf(files[i]);
                                            temp.splice(Index, 1);
                                        }
                                    }
                                    else{
                                        var Index = temp.indexOf(files[i]);
                                        temp.splice(Index, 1);
                                    }
                                }
                                nconf.set(`${replaceAll(dir, `${testFolder}/`, '')}`, temp);
                                console.log('INFO:'.cyan, `${name}`.cyan);
                            }
                        }
                    }
                }
            }
        }
    }
    return files_;
}
getFiles(testFolder);
nconf.clear(`${testFolder}`);
nconf.save();
if(env.first == false){
    env.first = true;
}
else{
    env.first = false;
}
fs.writeFileSync('./log/env.json', JSON.stringify(env), (err) => {
    console.log(err);
})
console.log('Done!'.green);


function replaceAll(str, find, replace) {
    var escapedFind=find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
}