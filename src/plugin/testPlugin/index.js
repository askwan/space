import map from './index.vue'
import PluginBase from '@/PluginBase'

const p = {
  show:true,
  name:'middle',
  tabs:'左',
  title:'pull',
  icon:'el-icon-time',
  toolbar:false,
  options:[{
    fn(){
      console.log('setting')
    },
    name:'时间'
  },{
    name:'工具',
    fn(){
      console.log('tool');
    }
  }],
  inited(){
    _bus.$on('middle.mapReady',manage=>{
      this.store.manage = manage;
    })
  },
  uis:[{name:'middle',show:true,tabs:'right-1',component:map,position:'middle'}],
  methods:{
    getCenter(){
      console.log('getCenter');
    },
    setCenter(options){
      this.store.manage.flyTo({
        center:[options.lng, options.lat]
      });
    }
  }
}

export default new PluginBase(p);

