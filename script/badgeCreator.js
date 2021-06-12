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
        var count = nconf.get(test).length;
        var badge = {
            "schemaVersion": 1,
            "label": test,
            "message": count,
            "color": randColor()
        };
        if(fs.existsSync(`./assets/badge/${test}.json`)){
            var old = require(`../assets/badge/${test}.json`);

            if(old.message >= count){
                badge = old;
            }
        }
        fs.writeFileSync(`./assets/badge/${test}.json`, JSON.stringify(badge));

        console.log(`INFO: Write badge ${test}`.cyan, `Color: ${badge.color}`.blue);
    })
})

if(!fs.existsSync(`./assets/badge/download.json`)){
    fs.writeFileSync(`./assets/badge/download.json`, JSON.stringify({
        "schemaVersion": 1,
        "label": "Animeback",
        "message": "Download Now For Free !",
        "color": "green"
      }));
}

console.log('Done!'.green);

function randColor(){
    var colors = ['brightgreen', 'green', 'yellowgreen', 'yellow', 'orange', 'red', 'blue', 'lightgrey', 'success', 'important', 'critical', 'informational', 'inactive', 'blueviolet', 'ff69b4', '9cf'];
    var number = Math.ceil(Math.random() * (colors.length - 0) + 0);
    return colors[number];
}