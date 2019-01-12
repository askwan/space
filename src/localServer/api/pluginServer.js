import {localUrl} from '../config'
import Base from './Base';

class PluginServer extends Base{
  constructor(){
    super();
    this.url = localUrl+'/api/'
  }
  query(option={}){
    // return new Promise((resolve,reject)=>{
    //   this.get('query',option).then(res=>{
    //     resolve(res)
    //   })
    //   .catch(err=>reject(err));
    // });
    return new Promise((resolve,reject)=>{
      let list;
      if(option.type==1){
        list = [{id:'dack_layout',name:'基本ui'}];
      }else if(option.type==2){
        list = [{id:"mapboxDemo",name:'楼宇管理'},{id:'spaceDemo1',name:'模型管理'},{id:'common_scene',name:'基础地图'}]
      }else if(option.type==3){
        list = [{id:'detail',name:'detail'}]
      }else{
        list = [];
      }
      resolve({status:200,list:list});
      
    })
  }
  download(options={}){
    return new Promise((resolve,reject)=>{
      this.get('download',options).then(res=>{
        resolve(res);
      })
      .catch(err=>reject(err));
    })
  }
  deletePlugin(options={}){
    return new Promise((resolve,reject)=>{
      this.get('delete',options).then(res=>{
        resolve(res);
      })
      .catch(err=>reject(err));
    })
  }
}

export default new PluginServer();

