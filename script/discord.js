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
const request = require('request');

var cache = require('../log/discordcache.json');

var embeder = [],
    newCache = cache.All;

nconf.file(config);

try {
  Object.keys(nconf.stores).forEach(function (name) {
    Object.keys(nconf.stores[name].store).forEach(function (test) {
      if(test !=  "interactive"){
        for(i=0;nconf.get(`${test}`).length > i;i++) {
          var count = nconf.get(`${test}:${i}`).length;
          var fileName = nconf.get(`${test}:${i}`).slice(0, count - 4);
          var newer = `https://raw.githubusercontent.com/LeGitHubDeTai/AnimeBack/main/images/preview/${test}/${fileName}.png`;
          if(cache.All.includes(`./images/preview/${test}/${nconf.get(`${test}:${i}`)}`) && !fs.existsSync(`./images/preview/${test}/${nconf.get(`${test}:${i}`)}`)){return;}
          console.log(`./images/preview/${test}/${nconf.get(`${test}:${i}`)}`)
          newCache.push(`./images/preview/${test}/${nconf.get(`${test}:${i}`)}`);
          embeder.push(
            {
              "title": "New Wallpaper",
              "color": 5892175,
              "description": `Name: ${fileName}\nCategorie: ${test}`,
              "timestamp": "",
              "url": "",
              "author": {
                "name": "AnimeBot",
                "url": "https://tai-studio.ml/",
                "icon_url": "https://raw.githubusercontent.com/LeGitHubDeTai/AnimeBack/main/icon.png"
              },
              "image": {
                "url": `${replaceAll(newer, ' ', '%20')}`
              },
              "thumbnail": {
                "url": "https://raw.githubusercontent.com/LeGitHubDeTai/AnimeBack/main/assets/checkGreen.png"
              },
              "footer": {
                "text": "- Tai Studio © 2021 -",
                "icon_url": "https://tai-studio.ml/img/icons/Tai_Studio_discord.png"
              },
              "fields": []
            });
        }
      }
    });
  });
} catch (error) {
  console.log(error);
}
finally {
  setTimeout(() => {
    loop();
  }, 1000);
  console.log('Done!'.green);
}
var sender = [];
function send(){
  var options = {
    url: `${process.env.Discord_Token}`,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'request'
    },
    body: JSON.stringify({
      "username": "AnimeBot",
      "avatar_url": "https://animeback.tai-studio.ml/",
      "content": "",
      "embeds": sender
    })
  };

  request.post(options, function (error, response, body) {
    console.log(error);
    console.log(body);
    fs.writeFileSync('./log/discordcache.json', JSON.stringify({"All": newCache}))
    setTimeout(() => {
      loop();
    }, 10000);
  })
}

function loop(){
  sender = embeder.splice(0,10);
  if(sender.length > 0){
    send();
  }
  console.log('loop ;)');
}

function replaceAll(str, find, replace) {
  var escapedFind=find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  return str.replace(new RegExp(escapedFind, 'g'), replace);
}
