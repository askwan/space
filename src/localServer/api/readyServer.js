import {localUrl} from '../config'
import Base from './Base';

class ReadyServer extends Base{
  constructor(){
    super();
    this.url = localUrl+'/api/'
  }
  loadSource(option={}){
    return new Promise((resolve,reject)=>{
      this.post('load_source',option).then(res=>{
        resolve(res)
      })
      .catch(err=>reject(err));
    })
  }
}

export default new ReadyServer();

