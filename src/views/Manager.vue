<template>
  <div class='manager fill flex'>
    <div class="menu-box">
      <tab-menu></tab-menu>
    </div>
    <div class="card-box">
      <!-- <component :is="componentId"></component> -->
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  // import {pluginServe} from '@/server'
  export default {
    data(){
      return {
        componentId:'sceneList'
      }
    },
    props:{},
    components:{
      'tab-menu':()=>import('@/components/manager/tabMenu'),
      'sceneList':()=>import('@/components/manager/right/scenes')
    },
    computed:{},
    mounted(){
      this.defaultIndex = this.$route.path;
    },
    watch:{

    },
    methods:{
      
    }
  }
</script>
<style lang='scss' scoped>
  .manager{
    $menu-width:240px;
    .menu-box{
      width: $menu-width;
      height: 100%;
      flex-shrink: 0;
      border-right: 1px solid #ccc;
    }
    .card-box{
      height: 100%;
      flex-grow: 1;
      // position: relative;
    }
  }
</style>
