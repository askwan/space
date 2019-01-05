<template>
  <div class='ui fill'>
    中间ui
  </div>
</template>
<script>
  // import THREE from './three'
  export default {
    data(){
      return {

      }
    },
    props:{},
    components:{},
    computed:{},
    mounted(){
      // console.log(THREE);
      let as = require(['./three.js']).then(res=>{
        console.log(res)
      })
      // console.log(as)
    },
    methods:{

    }
  }
</script>
<style lang='scss' scoped>
  .ui{
    background: #eee;
  }
</style>