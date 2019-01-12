import Base from './Base'
import {psdeUrl} from '../config'
class ConnectorServer extends Base {
  constructor(){
    super();
    this.url = psdeUrl +'oconnector';
  }
  getOtype(option){
    return new Promise((reslove,reject)=>{
      this.get('/query',option).then(res=>{
        reslove(res);
      })
      .catch(err=>{
        reject(err)
      })
    })
  }
  getList(option){
    return new Promise ((resolve,reject)=>{
      this.get('/query',option).then(res=>{
        resolve(res);
      })
      .catch(err=>{
        reject(err);
      })
    })
  }
}

export default new ConnectorServer();