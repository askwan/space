<template>
  <div class='frame-box fill'>
    <component :is="comp" :plugins="plugins" :view="mainView"></component>
  </div>
</template>
<script>
  import Vue from 'vue';
  export default {
    data(){
      return {
        compList:[],
        comp:'',
        mainView:'',
        plugins:[]
      }
    },
    props:['config'],
    components:{},
    computed:{},
    mounted(){
      // console.log(this.config);
      // this.initApp();
      this.$nextTick(()=>{
        // console.log(this.config,'config')
        // this.comp = '';
        this.dis = true;
        this.initApp();
      })
    },
    watch:{
      config(val){
        if(val.id){
          this.initApp();
        }
      }
    },
    methods:{
      initApp(){
        if(!this.config.layout) return
        import ('@/plugin/'+this.config.layout+'/index.vue').then(res=>{
          this.comp = Vue.component(this.config.layout,res.default);
        });
        if(this.config.plugins){
          this.plugins = this.config.plugins.map(el=>el.name);
        }
        this.mainView = this.config.mapView;
      }
    },
    destroyed(){
    }
  }
</script>
<style lang='scss' scoped>

</style>