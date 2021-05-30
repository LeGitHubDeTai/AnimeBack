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
const sharp = require('sharp');
const imagemin = require('imagemin');
const testFolder = './images';
var config = `${testFolder}/categories.json`;

nconf.file(config);

Object.keys(nconf.stores).forEach(function(name){
    Object.keys(nconf.stores[name].store).forEach(function(test){
        for(i=0;i<nconf.get(`${test}`).length;i++){
            var count = nconf.get(`${test}:${i}`).length;
            if(nconf.get(`${test}:${i}`).slice(count - 3, count) == "mp4"){
                var fileName = nconf.get(`${test}:${i}`).slice(0, count - 4);
                if(fs.existsSync(`${testFolder}/preview/${test}/${fileName}.png`)){
                    resize(`${testFolder}/preview/${test}/${fileName}.png`, 1920, 1080);
                }
            }
        }
    })
});

console.log('Done!'.green);

function resize(file, size, size2) {
    const newFile = file;
  
    // skip files that are up to date
    if (
      fs.existsSync(newFile) &&
      fs.statSync(newFile).mtime > fs.statSync(file).mtime
    ) {
      return Promise.resolve(null)
    }
  
    return (
      sharp(fs.readFileSync(file))
        .resize(size, size2, { fit: 'cover' })
        .toFormat('png')
        .toBuffer()
        .then((buf) => imagemin.buffer(buf))
        .then((buf) => fs.writeFileSync(newFile, buf))
    )
}