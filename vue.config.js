// const fs = require('fs');
// const path = require('path');
const serveApi = require('./api/index.js')
module.exports = {
  baseUrl: '',
  assetsDir:'./static/',
  filenameHashing:false,
  devServer: {
    port: 3006,
    host: '',
    open: true,
    hot:true,
    before: serveApi,
    overlay:true 
  }
}
