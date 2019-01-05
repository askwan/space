import PluginBase from '@/PluginBase'
import ui from './ui'
export default new PluginBase({
  show:true,
  name:'middle',
  tabs:'左',
  title:'pull',
  uis:[{
    name:'middle',
    show:true,
    tabs:'right-1',
    component:ui,
    position:'middle'
  }]
})
