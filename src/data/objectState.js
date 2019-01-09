// import {objectServer} from '@/server';
let objects = {};
export default {
  getObjectById(id){  
    return new Promise((resolve,reject)=>{
      let result = objects[id];
      if(result){
        resolve(result);
      }else{
        // objectServer.query({ids:id}).then(list=>{
        //   if(list[0]){
        //     objects[id] = list[0];
        //     result  = list[0];
        //     resolve(result);
        //   }
        // })
      }
    })
  }
}