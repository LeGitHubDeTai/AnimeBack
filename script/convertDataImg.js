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
var potrace = require('potrace');

var config = `./log/colorsFile.json`;
nconf.file(config);

const testFolder = './images/preview';

try {
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
                                if(fs.existsSync(`${name}`)){
                                    if(!fs.existsSync(`${name}.svg`)){
                                        convertToSVG(name);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return files_;
    }
} catch (error) {
    console.log(`ERROR: ${error}`.red);
}
finally{
    console.log(`Done !`.green);
}

function convertToSVG(file){
    if(file == null){return;}
    var out = `${file}.svg`
    
    try {
        potrace.posterize(file, function(err, svg) {
            if (err) throw err;
            fs.writeFileSync(out, svg);
            console.log(`INFO: ${file} Converted`.cyan);
        });
    } catch (error) {
        console.log(`ERROR: ${error}`.red);
    }
}
