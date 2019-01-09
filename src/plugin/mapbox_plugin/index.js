import map from './index.vue'
import PluginBase from '@/PluginBase'

export default new PluginBase({
  show:true,
  name:'mapbox_plugin',
  title:'pull',
  type:2,
  uis:[{
    show:true,
    name:'mapbox_plugin',
    component:map
  }],
  inited(){

  }
})