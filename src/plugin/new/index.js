import map from './index.vue'
import PluginBase from '@/PluginBase'
// import echarts from "./jscript/echarts.js"

const p = {
  show:true,
  name:'middle',
  tabs:'',
  title:'',
  icon:'',
  toolbar:false,
  options:[],
  type:2,
  inited(){
    // _bus.$on('middle.mapReady',manage=>{
    //   this.store.manage = manage;
    // })
  },
  uis:[{name:'middle',show:true,tabs:'right-1',component:map,position:'middle'}],
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

