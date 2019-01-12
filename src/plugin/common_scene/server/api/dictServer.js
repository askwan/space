import Base from './Base'
import {psdeUrl} from '../config'

class DictServer extends Base {
  constructor(){
    super();
    this.url = psdeUrl +'/dict'
  }
  getDict(name="",option={}){
    return new Promise((resolve,reject)=>{
      this.get('/getDict/'+name,option).then(res=>{
        resolve(res)
      })
      .catch(err=>{
        reject(err)
      })
    })
  }

}

export default new DictServer();