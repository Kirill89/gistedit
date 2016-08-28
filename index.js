'use strict';


const express = require('express');
const requestProxy = require('express-request-proxy');


express()
  .use('/', express.static('public'))
  .all('/gists/:id', requestProxy({
    url: 'https://api.github.com/gists/:id'
  }))
  .listen(process.env.PORT || 3000, () => {
    /* eslint-disable no-console */
    console.log('Started');
  });
