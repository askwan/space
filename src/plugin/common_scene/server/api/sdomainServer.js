import Base from './Base'
import {psdeUrl} from '../config'

class SDomainServer extends Base {
  constructor(){
    super();
    this.url = psdeUrl+'sdomain'
  }
  getList(options={}){
    return new Promise((resolve,reject)=>{
      this.get('/query',options).then(res=>{
        if(res.status==200){
          resolve(res.data)
        }else{
          reject(res);
        }
      }).catch(err=>{
        reject(err);
      })
    })
  }
}

export default new SDomainServer();