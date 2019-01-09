import PluginBase from '@/PluginBase'
import history from './components/history.vue'

export default new PluginBase({
  show:true,
  name:'history',
  tabs:'历史',
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
  }],
  uis:[{
    name:'history',
    component:history,
    tabs:'history',
    position:'right',
    icon: "el-icon-info"
  }]
})