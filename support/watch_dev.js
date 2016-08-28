/* eslint-disable no-console */
'use strict';


const fs = require('fs');
const path = require('path');
const exec = require('child_process').execSync;
const cwd = path.join(__dirname, '..');


let files = [
  { path: path.join(__dirname, '..', 'client', 'index.less'), size: 0, script: 'less' },
  { path: path.join(__dirname, '..', 'client', 'index.js'), size: 0, script: 'browserify' },
  { path: path.join(__dirname, '..', 'client', 'index.html'), size: 0, script: 'html' }
];


function checkUpdate() {
  files.forEach(fileInfo => {
    let stat = fs.statSync(fileInfo.path);

    if (stat.size !== fileInfo.size) {
      console.log(`===================== ${fileInfo.script} =====================`);
      exec(`npm run ${fileInfo.script}`, {cwd});
      fileInfo.size = stat.size;
    }
  });
}


setInterval(checkUpdate, 1000);
