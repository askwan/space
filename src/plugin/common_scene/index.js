import PluginBase from '@/PluginBase'
import mapView from './MapView'
import {State} from './store'

const plugin = {
  show:true,
  name:'middle',
  tabs:'左',
  toolbar:false,
  type:2,
  caption:'通用场景',
  uis:[{name:'middle',show:true,tabs:'right-1',component:mapView,position:'middle'}],
  inited(option){
    console.log(option,'option');
    State.sdomain = option.sdomain;
  },
  methods:{

  }
}

export default new PluginBase(plugin);