import map from './index.vue'
import PluginBase from '@/PluginBase'
// import echarts from "./jscript/echarts.js"
import store from './store'

const p = {
  show:true,
  name:'middle',
  tabs:'',
  title:'',
  icon:'',
  toolbar:false,
  options:[],
  type:2,
  inited(data){
    store.sdomains=data.sdomain.id

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

