<template>
  <div class='container fill'>
    <div id="map" class="fill"></div>
    <!-- <canvas id="deck-canvas"></canvas> -->
  </div>
</template>
<script>
  // import MapControl from './jscript/map'
  // import MapControl from './jscript/map'
  import * as GL from './MapGL'
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

      let mapGL = new GL.Mapbox({
        container:document.getElementById('map'),
        style: {
        version: 8,
        'sprite': 'http://116.62.28.103:8000/creator/static/mapbox/sprite',
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              'http://www.google.cn/maps/vt?lyrs=s@781&gl=cn&x={x}&y={y}&z={z}'
            ],
            tileSize: 256,
            minzoom: 0,
            maxzoom: 22
          },
          'vector-tiles': {
            'type': 'vector',
            'tiles': [
              `http://bt1.geosts.ac.cn/api/dae/geoservice/rest/v0.1.0/datastore/slave/geoservice/vectortile?row={y}&cols={x}&level={z}&code=3857&serviceType=VectorTile&sdomains=8939901214720`,
            ],
            'minzoom': 4,
            'maxzoom': 20
          }
        },
        layers: [{
          id: 'raster-tiles',
          type: 'raster',
          source: 'raster-tiles',
          minzoom: 0,
          maxzoom: 22
        }]
      },
      center: [114.28657510723633, 9.714421615090515],
      zoom: 18
      });

      axios.get('http://bt1.geosts.ac.cn/api/dae/geoservice/rest/v0.1.0/datastore/slave/geoservice/stylePreview/sourceLayers').then(res=>{
        res.data.forEach(layer=>{
          mapGL.addLayer(layer);
        })
      })

      mapGL.on('select',(data)=>{
        console.log('select',data)
      })
      mapGL.getLayer()


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