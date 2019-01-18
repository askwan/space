import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueWechatTitle from 'vue-wechat-title'; 
Vue.use(VueWechatTitle)

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import './assets/public/index.scss';
import './assets/style.scss'

Vue.use(ElementUI);
Vue.config.productionTip = false;
import './bus'

import * as state from '@/data'

import pluginManage from './pluginManager';

Vue.prototype._state_ = state;
Vue.prototype._pluginManage = pluginManage;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
