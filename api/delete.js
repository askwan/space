const fs = require('fs');

/**
 * 删除文件夹
 * @param {string} address 
 */
const deleteFolder = (address)=>{
  return new Promise((resolve,reject)=>{
    fs.readdir(address,async (err,list)=>{
      if(!err){
        for(let i=0;i<list.length;i++){
          let file = list[i];
          let currPath = address+'/'+file;
          let stats = fs.statSync(currPath);
          if(stats.isFile()){
            fs.unlinkSync(currPath);
          }else{
            await deleteFolder(currPath);
          }
        }
        fs.rmdirSync(address);
        resolve('已删除');
      }else{
        resolve('不存在');
      }
    })
  })
  
}

module.exports = async (req,res)=>{
  let options = req.query;
  let result = await deleteFolder('./src/plugin/'+options.name);
  res.json({
    status:200,
    message:'success',
    result:result
  });

};