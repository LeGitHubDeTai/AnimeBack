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

nconf.file(config);

try {
    try {
        Object.keys(nconf.stores).forEach(function(name){
            Object.keys(nconf.stores[name].store).forEach(function(test){
                if(test != "interactive"){
                    if(test != "generator"){
                        for(i=0;i<nconf.get(`${test}`).length;i++){
                            var count = nconf.get(`${test}:${i}`).length;
                            var fileName = nconf.get(`${test}:${i}`).slice(0, count - (nconf.get(`${test}:${i}`).split('.').pop().length + 1));
                            if(!fs.existsSync(`${testFolder}/preview/${test}/${fileName}.png`)){
                                console.log(`ERROR: ${testFolder}/preview/${test}/${fileName}.png NOT FOUND !`.red);
                            }
                        }
                    }
                }
                else{
                    for(i=0;i<nconf.get(`${test}`).length;i++){
                        var count = nconf.get(`${test}:${i}`).length;
                        var fileName = nconf.get(`${test}:${i}`).slice(0, count - (nconf.get(`${test}:${i}`).split('.').pop().length + 1));
                        if(fs.existsSync(`${testFolder}/${test}/${fileName}/Main.json`)){
                            let file = require(`.${testFolder}/${test}/${fileName}/Main.json`);
                            if(!fs.existsSync(`${testFolder}/preview/${test}/${fileName}/${file.preview}`)){
                                console.log(`ERROR: ${testFolder}/preview/${test}/${fileName}/${file.preview} NOT FOUND !`.red);
                            }
                        }
                    }
                }
            })
        });
    } catch (error) {
        console.log(error);
    }
    finally{
        console.log('Step 1: Done!'.green);
        try {
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
                            
                            if(name.lastIndexOf('.webp')){return;}

                            var tester = false,
                                ext = "null";
                            if(fs.existsSync(`${name.replace('png', 'mp4').replace('preview/', '')}`)){
                                tester = true;
                                ext = "mp4";
                            }
                            if(fs.existsSync(`${name.replace('png', 'webm').replace('preview/', '')}`)){
                                tester = true;
                                ext = "webm";
                            }
                            if(fs.existsSync(`${name.replace('png', 'gif').replace('preview/', '')}`)){
                                tester = true;
                                ext = "gif";
                            }

                            if(tester == false){
                                console.log(`ERROR: ${name.replace('png', ext).replace('preview/', '')} NOT FOUND !`.red);
                                fs.unlinkSync(name);
                            }
                            else{
                                console.log(`INFO: ${name.replace('png', ext).replace('preview/', '')} FOUND !`.cyan);
                            }
                        }
                    }
                }
                return files_;
            }
            getFiles(`${testFolder}/preview`);
        } catch (error) {
            console.log(error);
        }
        finally{
            console.log('Step 2: Done!'.green);
        }
    }
} catch (error) {
    console.log(error);
}
finally{
    console.log('Done!'.green);
}