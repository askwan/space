import PluginBase from '@/PluginBase'
import classViewList from './components/classViewTree.vue'


export default new PluginBase({
  show: true,
  name: 'classViewList',
  tabs: '类试图列表',
  title: 'pull',
  icon: 'el-icon-time',
  toolbar: true,
  options: [{
    fn() {
      console.log('setting')
    },
    name: '设置'
  }, {
    name: '工具',
    fn() {
      console.log('tool');
    }
  }],
  uis: [{
    name: '类试图列表',
    component: classViewList,
    tabs: '类视图',
    icon: "el-icon-info"
  }]
})