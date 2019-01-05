const fs = require('fs');
const request = require('request');
let pluginUrl = './src/plugin/';
let netRoot = 'http://bt1.geosts.ac.cn/api/onegis/open/api/v2/file/plugin/';
const unzip = require('unzip');
module.exports = (app)=>{
  app.post('/api/load_source',async (req,res)=>{
    // console.log(req);
    console.log(req.body);
    for(let i =0;i<req.body.lists.length;i++){
      let name = req.body.lists[i];
      let bool = fs.existsSync(pluginUrl+name)
      if(!bool){
        await download(name);
        
      }
    }
    res.json({status:200,message:'ready'});

  })
}


const download = (name)=>{

  return new Promise((resolve,reject)=>{

    let source_src = netRoot+'20181226/f23ffdf6f8ed4c23a232ea7a21ffa2da.zip';
    request.head(source_src);
    // let name = source_src.split('/');
    let aimSource = fs.createWriteStream(pluginUrl+name)
    request(source_src).pipe(aimSource);
    aimSource.on('close',async function(e,b){
      let _name = await unZip(pluginUrl+name)
      resolve(_name)
    })


  })

  
  
  
  
}

const unZip = (zip)=>{
  return new Promise((resolve,reject)=>{
    let readStream = fs.createReadStream(zip);
    let nameArr = zip.split('/');
    let name = nameArr[nameArr.length-1].replace('.zip','');
    let writeStream = unzip.Extract({path:'./src/plugin/'+name});
    readStream.pipe(writeStream);
    writeStream.on('close',err=>{
      if(!err){
        fs.unlink(zip,err=>{
          if(err) reject(err);
          resolve(name);
        })
        // resolve('完成')
      }
    })
  })
}