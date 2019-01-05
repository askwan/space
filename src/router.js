import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/page/Home.vue'
import {ucOnegis} from "@/server/newUrl.js"

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/',
      // component: Home,
      redirect:'/home'
    },
    // {
    //   path: '/manager',
    //   name: 'about',
    //   component:()=>import('@/views/Manager'),
    //   children:[{
    //     path:'cesium',
    //     component:()=>import('@/views/manageChild/cesiumScene')
    //   },{
    //     path:'mapbox',
    //     component:()=>import('@/views/manageChild/mapboxScene')
    //   }]
    // },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/create',
      name: 'create',
      component:()=>import('./views/page/create'),
    },
    {
      path: '/detail',
      name: 'detail',
      component:()=>import('./views/page/detail'),
    },
    {
      path:'/plugin',
      component:()=>import('./views/page/plugin'),
    },
    {
      path:'/view',
      component:()=>import('./views/page/view'),
    },
    //token页面
    {
      path: '/token',
      component:()=>import('./server/Token.vue'),
    },
  ]
})

export default router