let fs = require('fs');
let pluginPath = './src/plugin';

const readyPlugin = async (options)=>{
  return new Promise((resolve,reject)=>{
    fs.readdir(pluginPath,async (err,data)=>{
      if(!err){
        let configList = [];
        for(let i=0;i<data.length;i++){
          try {
            let config = await readconfig(data[i]);
            let type = getTypeValue(config);

            if(options.type===type){
              configList.push({
                id:data[i],
                name:getNameValue(config)
              });
            }
          } catch (error) {
            reject(error);
          }
        }
        resolve(configList);
      }else{
        reject(err);
      }
    })
  })
  
}

const getTypeValue = (str)=>{
  let reg = /type\s*:\s*.*,?/;
  let replaceReg = /type\s*:\s*/
  let matchValue = str.match(reg);
  if(matchValue instanceof Array){
    return matchValue[0].replace(replaceReg,"").replace(",","");
  }else{
    return "3"
  }
}
const getNameValue = (str)=>{
  let reg = /caption\s*:\s*.*,?/;
  let replaceReg = /caption\s*:\s*/
  let matchValue = str.match(reg);
  if(matchValue instanceof Array){
    return matchValue[0].replace(replaceReg,"").replace(/[,"']*/g,"")
  }else{
    return ""
  }
}

const readconfig = async (name)=>{
  return new Promise((resolve,reject)=>{
    let configfs = pluginPath+'/'+name+"/index.js";

    fs.readFile(configfs,'utf8',async (err,data)=>{
      if(!err){
        resolve(data);
      }else{
        resolve("");
      }
    })
  })
}



module.exports = async (req,res)=>{
  try {
    let plugins = await readyPlugin(req.query);
    res.json({
      status:200,
      list:plugins
    });
  } catch (error) {
    res.json({
      status:500,
      message:"error"
    })
  }
}


