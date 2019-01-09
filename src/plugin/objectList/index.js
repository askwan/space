import PluginBase from '@/PluginBase'
import tree from './components/objTree'
let plugin = new PluginBase({
  show:true,
  name:'objectList',
  tabs:'对象树',
  title:'pull',
  icon:'el-icon-time',
  toolbar:true,
  type:3,
  options:[{
    fn(){
      console.log('setting')
    },
    name:'设置'
  },{
    name:'工具',
    fn(){
      console.log('tool');
    }
  }]  
});

plugin.setUi({
  name:'objectTree',
  component:tree,
  tabs:'tree',
  icon: "el-icon-info"
});

export default plugin;