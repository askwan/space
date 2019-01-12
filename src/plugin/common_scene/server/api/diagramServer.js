import Base from './Base'
import {psdeUrl} from '../config'

class DiagramServer extends Base {
  constructor(){
    super();
    this.url = psdeUrl + 'diagram/'
  }
  query(option){
    return new Promise((reslove,reject)=>{
      this.get("query",option).then(res=>{
        reslove(res);
      })
      .catch(err=>{
        reject(err);
      })
    })
  }
}

export default new DiagramServer();