import PluginBase from '@/PluginBase'
import detail from './components/detail'

export default new PluginBase({
  show:true,
  name:'detail',
  tabs:'综合信息',
  title:'pull',
  icon:'el-icon-time',
  type:3,
  toolbar:false,
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
    name:'detail',
    component:detail,
    tabs:'detail',
    position:'right',
    icon: "el-icon-info"
  }],
  methods:{
  },
  inited(){
    // this.listenBus();
  }
})