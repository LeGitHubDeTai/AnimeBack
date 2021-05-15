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
const nconf = require('nconf');
const testFolder = './images';
var config = `${testFolder}/categories.json`;

nconf.file(config);

Object.keys(nconf.stores).forEach(function(name){
    Object.keys(nconf.stores[name].store).forEach(function(test){
        if(test != "interactive"){
            for(i=0;i<nconf.get(`${test}`).length;i++){
                var count = nconf.get(`${test}:${i}`).length;
                var fileName = nconf.get(`${test}:${i}`).slice(0, count - (nconf.get(`${test}:${i}`).split('.').pop().length + 1));
                if(!fs.existsSync(`${testFolder}/preview/${test}/${fileName}.png`)){
                    console.log(`ERROR: ${testFolder}/preview/${test}/${fileName}.png NOT FOUND !`.red);
                }
            }
        }
    })
});

console.log('Step 1: Done!'.green);

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        if(dir != `${testFolder}/interactive`){
            var name = dir + '/' + files[i];
            if (fs.statSync(name).isDirectory()){
                getFiles(name, files_);
            } else {
                files_.push(name);
            }
        }
    }
    return files_;
}
getFiles(`${testFolder}/preview`);

console.log('Step 2: Done!'.green);
console.log('Done!'.green);