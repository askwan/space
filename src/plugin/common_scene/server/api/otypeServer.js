import Base from './Base'
import {psdeUrl} from '../config'

class OtypeServer extends Base {
  constructor(){
    super();
    this.url = psdeUrl +'otype/';
  }
  query(option){
    return new Promise((resolve,reject)=>{
      this.get('query',option).then(res=>{
        resolve(res.data);
      })
      .catch(err=>{
        reject(err)
      })
    })
  }

}

export default new OtypeServer()