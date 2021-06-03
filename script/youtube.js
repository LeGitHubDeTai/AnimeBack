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
var fs = require('fs');
var decomposeUrl = require('decompose-url');
const youtubedl = require('youtube-dl-progress');

if(fs.existsSync('./log/downloader.json')){
    var listDownload = require('../log/downloader.json');

    var number = Object.keys(listDownload).length - 1;

    var url = decomposeUrl(listDownload[number].url),
        name = null;
    var video = youtubedl(`http://youtube.com/?v=${url.query['v']}`,
        // ['--format=bestvideo'],
        [],
        { cwd: __dirname });
    
    video.on('info', function(info) {
        console.log('Download started');
        name = info._filename.replace(info.id, '');
    });
    
    video.on('end', () => {
        fs.rename(`./images/${listDownload[number].categ}/null`, `./images/${listDownload[number].categ}/${name}`, (err) => {
            console.log(err);
        });
        delete listDownload[number];
        fs.writeFileSync('./log/downloader.json', JSON.stringify(listDownload));
    })

    video.pipe(fs.createWriteStream(`./images/${listDownload[number].categ}/${name}`));

}
else{
    console.log('Done ! (No Download)'.green);
}