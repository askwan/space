const request = require('request');
const fs = require('fs');
const unzip = require('unzip');




const unZip = (zip,fileName)=>{
  return new Promise((resolve,reject)=>{
    let readStream = fs.createReadStream(zip);
    let nameArr = zip.split('/');
    let name = fileName||nameArr[nameArr.length-1]
    name = name.split('.')[0];
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

module.exports = async (req,res)=>{
  // let bool1 = fs.existsSync('./source');
  // let bool2 = fs.existsSync('./bool')
  // console.log(bool1,bool2);
  // let name = req.query.name;
  let source_src = req.query.fileUrl;
  let zipName = source_src.split('/');
  zipName = source_src[zipName.length-1];
  // let source_src = 'http://bt1.geosts.ac.cn/api/onegis/open/api/v2/file/plugin/20181226/f23ffdf6f8ed4c23a232ea7a21ffa2da.zip';
  request.head(source_src);
  let name = req.query.name || zipName;
  let aimSource = fs.createWriteStream(zipName)
  request(source_src).pipe(aimSource);
  aimSource.on('close',async function(e,b){
    let _name = await unZip(zipName,name)
    res.json({
      stauts:200,
      message:'success',
      name:_name
    })
  })
}
