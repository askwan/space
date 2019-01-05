import Base from './base'

class PageServe extends Base{
  constructor(){
    super();
    this.url = 'http://localhost:3000/v0.0.1/api/page';
  }
  createScene(option={}){
    return new Promise((reslove,reject)=>{
      this.post('/insert',option).then(res=>{
        reslove(res);
      })
      .catch(err=>{
        reject(err)
      })
    })
  }
  getScenes(option={}){
    return new Promise((reslove,reject)=>{
      this.get('/query',option).then(res=>{
        reslove(res);
      })
      .catch(err=>{
        reject(err);
      })
    })
  }
}

export default new PageServe();