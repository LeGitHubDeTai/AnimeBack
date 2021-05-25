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
const extractFrames = require('ffmpeg-extract-frames');
const fs = require('fs');
const path = require('path');
const nconf = require('nconf');
const testFolder = './images';
var config = `${testFolder}/categories.json`;
const axios = require('axios');

nconf.file(config);

Object.keys(nconf.stores).forEach(function(name){
    Object.keys(nconf.stores[name].store).forEach(function(test){
        for(i=0;i<nconf.get(`${test}`).length;i++){
            var count = nconf.get(`${test}:${i}`).length;
            if(nconf.get(`${test}:${i}`).slice(count - 3, count) == "mp4"){
                var fileName = nconf.get(`${test}:${i}`).slice(0, count - 4);
                if(!fs.existsSync(`${testFolder}/preview/${test}/${fileName}.png`)){
                    extractFrames({input: `${testFolder}/${test}/${fileName}.mp4`, output: `${testFolder}/preview/${test}/${fileName}.png`,offsets: [1]});
                    axios.post(`${process.env.NEW_WALLPAPERS}`, {
                        username: "AnimeBot",
                        avatar_url: "https://raw.githubusercontent.com/LeGitHubDeTai/AnimeBack/main/icon.png",
                        content: null,
                        embed: [{
                            "username": "AnimeBot",
                            "avatar_url": "https://animeback.tai-studio.ml/",
                            "content": "",
                            "embeds": [
                              {
                                "title": "New Wallpaper",
                                "color": 5892175,
                                "description": `Categorie: ${test}`,
                                "url": "",
                                "author": {
                                  "name": "AnimeBot",
                                  "url": "https://tai-studio.ml/",
                                  "icon_url": "https://raw.githubusercontent.com/LeGitHubDeTai/AnimeBack/main/icon.png"
                                },
                                "image": {
                                  "url": path.join('https://github.com/LeGitHubDeTai/AnimeBack/blob/main/', `${testFolder}/preview/${test}/${fileName}.png`)
                                },
                                "thumbnail": {
                                  "url": "https://raw.githubusercontent.com/LeGitHubDeTai/AnimeBack/main/assets/checkGreen.png"
                                },
                                "footer": {
                                  "text": "- Tai Studio © 2021 -",
                                  "icon_url": "https://tai-studio.ml/img/icons/Tai_Studio_discord.png"
                                },
                                "fields": []
                              }
                            ]
                          }]
                      })
                      .then(function (response) {
                      })
                      .catch(function (error) {
                      });
                }
            }
        }
    })
});

console.log('Done!'.green);