const fs = require('fs');
module.exports = function(app){
  app.get('/api/create_scene', function(req, res) {
    let address = './plugin/'+req.query.name
    fs.mkdir(address,{},err=>{
      if(!err) {
        fs.rename('./plugin/index.vue',address+'/index.vue',err=>{
          if(!err) res.json({status:200,message:'success',data:{name:req.query.name}});
        })
      }
      
    })
    // res.json({ custom: req.query });
  });
}