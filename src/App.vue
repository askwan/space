<template>
  <div id="app" class="fill">
    <div id="nav" v-if="show" >
      <nav-header v-if="!$route.path.includes('/token')"></nav-header>
    </div>
    <div  class="app-content" :class="show?height:''">
      <router-view/>
    </div>
  </div>
</template>

<script>
import {ucOnegis} from "@/server/newUrl.js"

  export default {
    data(){
      return {
        show:true,
        height:'app-height',
        ucOnegi:""
      }
    },
    components:{
      'nav-header':()=>import('@/components/header')
    },
    mounted() {
      this.ucOnegi = ucOnegis + window.location.href;
      // console.log(this.ucOnegi)
      // this.$router.go(this.ucOnegi);
      let url = location.href
      let num = url.indexOf("view")
      if(num != -1){
        this.show = false
      };
    },
  }
</script>

<style lang="scss">
$nav-height:50px;

#nav {
  height: $nav-height;
  border-bottom: 1px solid #ccc;
}
.app-content{
  height: 100%;
  overflow: hidden;
  position: relative;
  overflow-y: auto;
  // background-color: #f8f8f8;
}
.app-height{
  height: calc(100% - #{$nav-height});
}
</style>
