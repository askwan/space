import {localUrl} from '../config'
import Base from './Base';

class PluginServer extends Base{
  constructor(){
    super();
    this.url = localUrl+'/api/'
  }
  query(option={}){
    return new Promise((resolve,reject)=>{
      this.get('query',option).then(res=>{
        resolve(res)
      })
      .catch(err=>reject(err));
    })
  }
  download(options={}){
    return new Promise((resolve,reject)=>{
      this.get('download',options).then(res=>{
        resolve(res);
      })
      .catch(err=>reject(err));
    })
  }
}

export default new PluginServer();

