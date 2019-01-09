const bodyParser = require('body-parser');
// const createScene = require('./create_scene.js')
// const getScene = require('./get_scenes.js')
// const loadSource = require('./load_source.js')
const queryApi = require('./query.js')
const downloadApi = require('./download.js')
module.exports = function(app,server){
  app.use(bodyParser.json());
  let urlencodeParser = bodyParser.urlencoded({extended:false});
  app.use(urlencodeParser);
  // createScene(app);
  // getScene(app);
  // loadSource(app);
  app.get('/api/query',queryApi);
  app.get('/api/download',downloadApi);
}