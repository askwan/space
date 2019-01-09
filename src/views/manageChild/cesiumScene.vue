<template>
  <div class='cesium-box'>
    <component :is="componentId"></component>
  </div>
</template>
<script>
  // import {pluginServe} from '@/server'
  export default {
    data(){
      return {
        componentId:''
      }
    },
    props:{},
    components:{},
    computed:{},
    mounted(){
      this.getPlugin();
      this.componentId = ()=>import('@/../plugin/c_plugin-3');
    },
    methods:{
      getPlugin(){
        let path = this.$route.fullPath;
        let typeId = 1;
        // pluginServe.getPlugins({typeId}).then(res=>{
        //   console.log(res.data);
        // })
      }
    }
  }
</script>
<style lang='scss' scoped>

</style>