const fs = require('fs');

module.exports = (app)=>{
  app.get('/api/get_scenes',(req,res)=>{
    fs.readdir('./plugin',(err,data)=>{
      res.json({status:200,data})
    })
  })
}