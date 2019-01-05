<template>
  <div class='plugin-1 fill'>
    <div class="fill" id="map"></div>
  </div>
</template>
<script>
import NullIslandLayer from "./js/NullIslandLayer";
import OneSisCustomLayer from "./js/OneSisCustomLayer";
import BuildingLayer from "./js/BuildingLayer";
import './style.scss'
export default {
  data() {
    return {};
  },
  props: {},
  components: {},
  computed: {},
  mounted() {
    requirejs(
      [
        "https://api.tiles.mapbox.com/mapbox-gl-js/v0.51.0/mapbox-gl.js",
        "/js/three.js"
      ],
      function(mapboxgl, THREE) {
        window.THREE = THREE;
        requirejs(["/js/GLTFLoader.js","/js/DRACOLoader.js","/js/draco_decoder.js"], function(GLTFLoader,DRACOLoader) {
          mapboxgl.accessToken =
            "pk.eyJ1IjoieHRwZ2t4ayIsImEiOiJSUEhldmhZIn0.dJzz5bXztrZRAViAdmQvyQ";
          var map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v9",
            zoom: 16.5,
            center: [113.6761245, 34.74838943],
            bearing: 20,
            pitch: 60
          });

          map.on("load", function() {
          //  map.addLayer(new NullIslandLayer());
            // map.addLayer(new OneSisCustomLayer());
            map.addLayer(new BuildingLayer());
          });
        });
      }
    );
  },
  methods: {}
};
</script>
<style lang='scss' scoped>
</style>