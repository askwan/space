import axios from 'axios'
export default class Base {
  constructor(){}
  get(name,options){
    let url = this.url+name;
    return new Promise((resolve,reject) => {
      axios.get(url,{
        params:options
      })
      .then(res=>{
        if(res.status==200){
          resolve(res.data)
        }else{
          reject(res);
        }
      })
      .catch(err=>{
        reject(err)
      })
    })
  }
  post(name,options){
    let url = this.url+name;
    Object.assign(options,{token:this.getToken()})
    return new Promise((resolve,reject)=>{
      axios.post(url,options)
        .then(res=>{
          if(res.status==200){
            resolve(res.data)
          }else{
            reject(res);
          }
        })
        .catch(err=>{
          reject(err)
        })
    })
  }
  upload(){
    let config = {headers:{'Content-Type':'multipart/form-data'}};
    let url = this.url+name+'?token='+this.getToken();
    return new Promise((resolve,reject)=>{
      axios.post(url,options,config)
        .then(res=>{
          if(res.status==200){
            resolve(res.data)
          }else{
            reject(res);
          }
        })
        .catch(err=>{
          reject(err)
        })
    })
  }
  getToken(){
    return localStorage.getItem('token') || ''
  }
}