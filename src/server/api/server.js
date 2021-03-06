import Base from './base'
import axios from 'axios'

class ServerApp extends Base {
    constructor(){
      super();
      //space基础地址
      this.host = 'http://bt1.geosts.ac.cn/api'
      this.imageUrl = "http://bt1.geosts.ac.cn/api/onegis/open/api/v2"; //公司上传图片公共服务

      this.url = `${this.host}/onegis/open/space/rest/v0.2.0/datastore/space`;
      // this.url = 'http://192.168.1.133:8083/rest/v0.2.0/datastore/space'
      
      //web插件
      this.toolsUrl = `${this.host}/onegis/resource/tools/api/v1`
      // this.toolsUrl = 'http://192.168.1.133:8083/api/v1'
      //时空域
      this.SDomain = `${this.host}/dae/datastore/rest/v0.1.0/datastore`
      //图片上传
    }
    getToken(){
      return sessionStorage.getItem('token');
    }
    saveApp(options){
      return new Promise((resolve,reject)=>{
        this.post(`/save?token=${this.getToken()}`,options).then(res=>{
          resolve(res);
        })
        .then(err=>{
          reject(err);
        })
      })
    }
    deleteApp(id){
        return new Promise((resolve,reject)=>{
            this.post(`/delete?token=${this.getToken()}&id=${id.id}`,id).then(res=>{
                resolve(res);
            })
            .then(err=>{
                reject(err);
            })
        })
    }
    getApps(options){
        return new Promise((resolve,reject)=>{
            this.get('/query',options).then(res=>{
                resolve(res);
            })
            .then(err=>{
                reject(err);
            })
        })
    }
    // AppPlugin(options){
    //     return new Promise((resolve,reject)=>{
    //         this.get(,options).then(res=>{
    //             resolve(res);
    //         })
    //         .then(err=>{
    //             reject(err);
    //         })
    //     })
    // }
    getPlugins(options){
        return new Promise((resolve,reject)=>{
            var str = "";
            for (var key in options) {
                str = str + '&' + key + '=' + options[key];
            }
            axios.get(`${this.toolsUrl}/resource/query?token=${this.getToken()}`+ str)
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

    getDomain(options){
        return new Promise((resolve,reject)=>{
            var str = "";
            for (var key in options) {
                str = str + '&' + key + '=' + options[key];
            }
            axios.get(`${this.SDomain}/sdomain/query?token=${this.getToken()}`+ str)
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



  }
  
  export default new ServerApp()