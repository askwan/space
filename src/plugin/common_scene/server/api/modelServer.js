import Base from './Base'
import {psdeBaseUrl,token} from '../config'

class ModelServer extends Base {
  constructor(){
    super();
    this.url = psdeBaseUrl +'/dae/model-service/model/rest/v0.1.0/datastore/slave/model/file';
    
  }
  getModel(option={}){
    return new Promise((resolve,reject)=>{
      this.get('/query',option).then(res=>{
        resolve(res);
      })
      .catch(err=>{
        reject(err)
      })
    })
  }
  upload(option){
    return new Promise((resolve,reject)=>{
      this.upload('/upload',option).then(res=>{
        resolve(res);
      })
      .catch(err=>{
        reject(err);
      })
    })
  }
  uploadUrl(){
    return this.url+'/upload?'
  }
  uploadMode(option){
    let formData= new FormData();
    formData.append('file',option.file.raw);
    let url = this.url+'/upload'+`?token=${token}&name=${option.name}&des=${option.desc}`
    return new Promise((resove,reject)=>{
      this.uploadFile(url,formData).then(res=>{
        if(res.status==200) {
          resove(res);
        }else{
          reject(res)
        }
      },(err)=>{
        reject(err)
      })
    })
  }
  downloadUrl(name){
    return this.url+'/download/'+name;
  }
  updateMode(option){
    return new Promise((resolve,reject)=>{
      this.post('/update',option).then(res=>{
        resolve(res);
      })
      .catch(err=>{
        reject(err);
      })
    })
  }
  deleteMode(id){
    return new Promise((resolve,reject)=>{
      this.post('/delete/'+id,{}).then(res=>{
        resolve(res);
      })
      .catch(err=>{
        reject(err);
      })
    })
  }
}

export default new ModelServer();