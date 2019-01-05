<template>
  <div class='fill'>
    <el-menu
      :default-active="defaultIndex"
      :router="true"
      >
      <el-menu-item v-for="tab in tabs" :index="tab.path" :key="tab.id">
        <i :class="[tab.icon]"></i>
        <span>{{tab.name}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        tabs:[{id:"1",name:'cesium',path:'/manager/cesium',icon:'el-icon-menu'},{id:"2",name:'mapbox',path:'/manager/mapbox',icon:'el-icon-menu'}],
        defaultIndex:'/manager/cesium'
      }
    },
    props:{},
    components:{},
    computed:{},
    mounted(){
      this.defaultIndex = this.$route.path;
    },
    methods:{

    }
  }
</script>
<style lang='scss' scoped>

</style>