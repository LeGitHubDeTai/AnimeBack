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
const rimraf = require('rimraf');

rimraf('./assets/badge/*', (err) => console.error('Done !'));
rimraf('./log/colorsFile.json', (err) => console.error('Done !'));
rimraf('./log/env.json', (err) => console.error('Done !'));
rimraf('./log/preview/', (err) => console.error('Done !'));
rimraf('./images/preview/', (err) => console.error('Done !'));
rimraf('./images/categories.json', (err) => console.error('Done !'));