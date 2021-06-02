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
const rimraf = require('rimraf');
const testFolder = './images';
const nconf = require('nconf');

var config = `${testFolder}/categories.json`;
nconf.file(config);

var categories = require('../images/categories.json');

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            rimraf.sync(`${name}/*.sfk`);
            rimraf.sync(`${name}/*.crdownload`);
            rimraf.sync(`${name}/*-1920.png`);
            if(name == "./images/preview"){
                rimraf.sync(`${name}/.json`);
            }
            console.log(name)
            getFiles(name, files_);
        }
    }
    return files_;
}
getFiles(testFolder);

if(categories['animals'] != null){
    var animals = categories['animals'].filter((id) => id !== `Categories.json`);
    nconf.set('animals', animals);
    nconf.save();
}

console.log('Done!'.green);


// var preview = name.slice(0, name.length - 3);

// switch(name.slice(name.length - 3, name.length)){
//     case "ebm":
//         var fileName = name.slice(0, name.length - 5);
//         if(fs.existsSync(`${preview.replace(dir, `${testFolder}/preview${dir.replace(testFolder, '')}`)}.png`)){
//             nconf.set(`${dir.replace(`${testFolder}/`, '')}`, temp);
//         }
//         break;
//     default:
//         var fileName = name.slice(0, name.length - 4);
//         if(fs.existsSync(`${preview.replace(dir, `${testFolder}/preview${dir.replace(testFolder, '')}`)}png`)){
//             nconf.set(`${dir.replace(`${testFolder}/`, '')}`, temp);
//         }
// }
