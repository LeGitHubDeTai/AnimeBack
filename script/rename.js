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
const testFolder = './images';

if(fs.existsSync('./log/colorsFile.json')){
    var old = require('../log/colorsFile.json');
}

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        if(dir != `${testFolder}/categories.json`){
            if(dir != `${testFolder}/interactive`){
                var name = dir + '/' + files[i];
                if (fs.statSync(name).isDirectory()){
                    getFiles(name, files_);
                } else {
                    files_.push(name);
                    var newName = dir + '/' + capitalizeFirstLetter(lowersWords(files[i]));
                   
                    var renamer = getFirstLetter(newName);
                        renamer = replaceAll(renamer, 'wallpaper', '');
                        renamer = replaceAll(renamer, 'Wallpaper', '');
                        renamer = replaceAll(renamer, 'anime-', '');
                        renamer = replaceAll(renamer, 'animated-', '');
                        renamer = replaceAll(renamer, 'gaming-', '');
                        renamer = replaceAll(newName, '-', ' ');
                        renamer = replaceAll(renamer, '-', ' ');
                        renamer = replaceAll(renamer, '_', ' ');
                        renamer = replaceAll(renamer, '  ', ' ');
                        renamer = replaceAll(renamer, ' .', '.');
                        renamer = replaceAll(renamer, ')', '');
                        console.log(`INFO: ${renamer}`.cyan);
                    fs.renameSync(name, renamer);
                }
            }
        }
    }
    return files_;
}
getFiles(testFolder);

function replaceAll(str, find, replace) {
    var escapedFind=find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function lowersWords(string) {
    return string.replace(/(?:^|\s)\S/g, function(a) { return a.toLowerCase(); });
};
function getFirstLetter(string) {
    if(string.charAt(0) == " "){
        return string.slice(1);
    }
    else{
        return string;
    }
}

console.log('Done!'.green);