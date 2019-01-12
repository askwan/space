<template>
  <div class='map-view fill'>
    <div id="map-box" class="fill"></div>
  </div>
</template>
<script>
  import {MapBoxGL} from './mapboxGL'
  import {State} from './store'
  import {sdomainServer,objectServer} from './server'
  export default {
    data(){
      return {

      }
    },
    props:{},
    components:{},
    computed:{},
    mounted(){
      // let mapGl = new MapBoxGL();
      // this.getPosition();
      this.initMap();
    },
    methods:{
      getPosition(){
        sdomainServer.getList({id:State.sdomain.id})
      },
      async initMap(){
        let mapGl = new MapBoxGL();
        let res = await sdomainServer.getList();
        let domain = res.list.find(el=>el.id==State.sdomain.id);
        let center = mapGl.getCenter(domain.geoBox);
        mapGl.initMap(document.getElementById('map-box'),State.sdomain);
        mapGl.setCenter(center);
        this.listenMap(mapGl);
        _bus.$emit('middle.GL',mapGl);
      },
      listenMap(mapGl){
        mapGl.on('select',(data)=>{
          let obj = {
            ids:data.oid,
            uids:'',
            loadForm: true,
            loadObjType: true,
            loadAction: true
          }
          objectServer.query(obj).then(res=>{
            if(res.list[0]){
              _bus.$emit('middle.select',res.list[0]);
            }
          })
        })
      }
    }
  }
</script>
<style lang='scss' scoped>

</style>