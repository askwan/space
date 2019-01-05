import PluginBase from '@/PluginBase'
import right1 from './right'


let plugin = new PluginBase({
  show:true,
  name:'plugin_2',
  tabs:'左',
  title:'push',
  icon:'el-icon-time',
  toolbar:true,
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
  }]
});

plugin.setUi({name:'right',show:true,tabs:'right-1',component:right1,position:'right'});

plugin.inited = ()=>{
  _bus.$on('middle.mapReady',manage=>{
    // console.log(manage,'插件中的监听')
  })
}

export default plugin
