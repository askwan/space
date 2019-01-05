import map from './index.vue'
import PluginBase from '@/PluginBase'
// console.log(map)
// export default {
//   config:{
//     show:true,
//     name:'mapbox_plugin',
//     tabs:'左',
//     title:'pull'
//   },
//   uis:[map]
// }

export default new PluginBase({
  show:true,
  name:'mapbox_plugin',
  title:'pull',
  uis:[{
    show:true,
    name:'mapbox_plugin',
    component:map
  }],
  inited(){

  }
})