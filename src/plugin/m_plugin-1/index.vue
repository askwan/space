<template>
  <div class='plugin-1'>
    <el-button @click="explain">m_plugin_1</el-button>
  </div>
</template>
<script>
  import axios from 'axios'
  
  export default {
    data(){
      return {

      }
    },
    props:{},
    components:{},
    computed:{},
    mounted(){
      
      
    },
    methods:{
      explain(){
        console.log('explain')
      }
    }
  }
</script>
<style lang='scss' scoped>
  .plugin-1{
    position: absolute;
    top: 100px;
    left:100px;
  }
</style>