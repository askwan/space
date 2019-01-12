import Base from './Base'
import {psdeUrl} from '../config'

class VersionServer extends Base {
  constructor(){
    super();
    this.url = psdeUrl +'version/list/';
  }
  getVersions(params={}){
    return new Promise((resolve, reject)=>{
      this.get('query',params).then(res=>{
        if(res.status==200){
          resolve(res.data);
        }else{
          reject(res);
        }
      },err=>{
        reject(res);
      })
    })
  }
}

export default new VersionServer();