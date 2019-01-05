import left from './left1';
import right from './left2';

import PluginBase from '@/PluginBase.js'
let plugin = new PluginBase({
    show:true,
    name:'plugin_1',
    tabs:'左',
    title:'pull',
    icon:'el-icon-setting',
    toolbar:true,
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

//添加vue组件
plugin.setUi({name:'left',component:left,tabs:'左'});
plugin.setUi({name:'right',component:right,tabs:"右",position:'right'});

const methods = {
  aaa(){
    console.log(this,'this');
  }
}

plugin.setFn(methods);
export default plugin;