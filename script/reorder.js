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
const nconf = require('nconf');

var colors = require('colors');
const testFolder = './log';
var config = `${testFolder}/colorsFile.json`;

nconf.file(config);

var allBlack = nconf.get('Black') || [],
    allOther = nconf.get('Other') || [],
    allDetect = nconf.get('Detect') || [];

try {
    Object.keys(nconf.stores).forEach(function(name){
        Object.keys(nconf.stores[name].store).forEach(function(test){
            switch(test){
                case "Black":
                    for(i=0;i<nconf.get(`${test}`).length;i++){
                        console.log(test,nconf.get(`${test}:${i}`));
                        if(allDetect.includes(nconf.get(`${test}:${i}`))){
                            if(allBlack.length == 1){
                                allBlack = [];
                            }
                            else{
                                allBlack = allBlack.filter((id) => id === nconf.get(`${test}:${i}`));
                            }
                        }
                    }
                    break;
                default:
                    console.log(test);
            }
        })
    });
} catch (error) {
    console.log(error);
}
finally{
    nconf.set('Black', allBlack);
    nconf.save();
    console.log('Done!'.green);
}
