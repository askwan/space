<template>
  <div class='container fill'>
    <div id="map" class="fill"></div>
    <!-- <canvas id="deck-canvas"></canvas> -->
  </div>
</template>
<script>
  // import MapControl from './jscript/map'
  import MapControl from './jscript/map'
  export default {
    data(){
      return {
        
      }
    },
    props:{},
    components:{},
    computed:{},
    mounted(){
      // init();
      // console.log('视图的mounted');
      let mapControl = new MapControl({container:'map',style:'mapbox://styles/mapbox/dark-v9'});
      _bus.$emit('middle.mapReady',mapControl);
      mapControl.map.on('click',event=>{
        _bus.$emit('middle.click',event)
      });
      this.initJs();
    },
    methods:{
      setcenter(){
        console.log('sdfsfdsdf')
      },
      initJs(){
        
      }
    }
  }
</script>
<style lang='scss' scoped>
  .container{
    background-color: #f1f1f1;
  }
  // #deck-canvas{
  //   position: absolute;
  // }
</style>