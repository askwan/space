import otypeState from './otypeState'
import {diagramServer} from '@/server'
let diagrams = [];
export default {
  getDiagram(options={}){
    return new Promise((resolve)=>{
      if(diagrams.length==0){
        diagramServer.query(options).then(lists=>{
          diagrams = lists;
          otypeState.setOtypes(lists);
          resolve(lists);
        })
      }else{
        resolve(diagrams);
      }
    })
  }
}