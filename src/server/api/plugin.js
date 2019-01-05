import Base from './base'

class PluginServe extends Base {
  constructor(){
    super();
    this.url = 'http://localhost:3000/v0.0.1/api/plugin';
  }
  getPlugins(options={}){
    return new Promise((resolve,reject)=>{
      this.get('/query',options).then(res=>{
        resolve(res);
      })
      .then(err=>{
        reject(err);
      })
    })
  }
}

export default new PluginServe