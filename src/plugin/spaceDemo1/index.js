import map from './index.vue'
import PluginBase from '@/PluginBase'
// import echarts from "./jscript/echarts.js"

const p = {
  show:true,
  name:'spaceDemo1',
  type:2,
  tabs:'',
  title:'',
  icon:'',
  toolbar:false,
  options:[],
  inited(){
    // _bus.$on('middle.mapReady',manage=>{
    //   this.store.manage = manage;
    // })
  },
  uis:[{name:'spaceDemo1',show:true,tabs:'right-1',component:map,position:'middle'}],
  methods:{
    // getCenter(){
    //   console.log('getCenter');
    // },
    // setCenter(options){
    //   this.store.manage.flyTo({
    //     center:[options.lng, options.lat]
    //   });
    // }
  }
}

export default new PluginBase(p);

