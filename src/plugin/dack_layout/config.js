import Vue from 'vue';
import pluginManage from '@/pluginManager'

export default {
  data(){
    return {
      comps:{
        plugins:[],
        view:{}
      }
    }
  },
  mounted() {
    this.init();
    console.log(_bus)
      console.log(this.sdomain,'sdomain')
  },
  methods:{
    async init(){
      let comp = {};
      let mainView = await this.loadMainView(this.view);
      comp.view = mainView;
      comp.plugins = [];
      for(let i in this.plugins){
        let pluginName = this.plugins[i];
        let plugin = await this.loadUi(pluginName);
        comp.plugins.push(plugin);
      };
      this.ready(comp);
    },
    async loadMainView(name){
      let view = await this.load(name);
      return new Promise((resolve,reject)=>{
        resolve(view);
      })
    },
    async loadUi(name){
      let ui = await this.load(name);
      return new Promise((resolve,reject)=>{
        // pluginManage.setPlugin(ui);
        resolve(ui);
      })
    },
    /**
     * 将配置转化为插件
     * @param {string} name 
     */
    async load(name){
      let module = await import('@/plugin/'+name+'/index.js');
      let plugin = module.default;
      for(let k in plugin.uis){
        let pluginConfig = plugin.uis[k];
        pluginConfig.name = this.randomName();
        pluginConfig.component = Vue.component(name,pluginConfig.component);
      };
      if(typeof plugin.inited=='function'){
        plugin.inited();
      }
      pluginManage.setPlugin(plugin);
      return new Promise((resolve,reject)=>{
        resolve(plugin)
      })
    },
    ready(module){
      // throw new Error('需要一个ready方法加载插件');
      this.manage.uiManage.setMiddleUi(this, module.view);
      module.plugins.forEach(plugin => {
        this.manage.uiManage.setToolBar(plugin);
        this.manage.uiManage.setPluginUi(this, plugin);
      });

      this.initSize();
      if(typeof this.uiReady === 'function'){
        this.uiReady();
      }

      this.manage.uiManage.setMiddlePlugin();
      let plugins = this.manage.uiManage.manageUi;
      for(let name in plugins){
        this.manage.uiManage.setPlugin(name);
      }
      if(typeof this.pluginReady === 'function'){
        this.pluginReady();
      }
    },
    randomName(num = 5){
      let letters = 'qwertyuiopasdfghjklzxcvbnm';
      let arr = letters.split('');
      let str = '';
      for(let i=0; i<num;i++){
        let randomNum = Math.floor(Math.random()*arr.length);
        str+=arr[randomNum];
      };
      return str;
    }
  }
}
