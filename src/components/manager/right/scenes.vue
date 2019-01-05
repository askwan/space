<template>
  <div class='content fill pd-top-big'>
    <div class="card-box flex wrap">
      <div v-for="i in 5" :key="i" class="card-el mg-left-big mg-bottom-big pointer-shadow"></div>
      <div class="box-add mg-left-big mg-bottom-big flex-center no-select pointer-shadow" @click="addScene">
        <i class="el-icon-plus font-36 font-gray pointer-default"></i>
      </div>
      <div class="box-add mg-left-big mg-bottom-big flex-center no-select pointer-shadow" @click="addRouter">
        <!-- <i class="el-icon-plus font-36 font-gray pointer-default"></i> -->
        <span>addrouter</span>
      </div>
    </div>
    
  </div>
</template>
<script>
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
      addScene(){
        console.log('add'); 
      },
      addRouter(){
        // this.$router.addRoutes([{
        //   path:'/scene/qwe',
        //   component:()=>import('@/../plugin/'+"qwe")
        // }])
      }
    }
  }
</script>
<style lang='scss' scoped>
  .content{
    overflow-y: auto;
  }
  .card-box{
    .card-el{
      width: 300px;
      height: 200px;
      border: 1px solid #ccc;
    }
  }
  .box-add{
    width: 300px;
    height: 200px;
    border: 1px solid #ccc;
  }
</style>