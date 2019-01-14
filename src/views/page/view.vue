<template>
    <div class="viewMap" v-wechat-title="$route.meta.title">
        <div class="detail fill">
        <!-- <div class="leader cle">
            <b>{{config.name}}</b>
        </div> -->
        <!-- content -->
        <div class="fill">
            <app-frame :config="config"></app-frame>
        </div>
        </div>
    </div>
</template>
<script>
import {serverApp} from '@/server/index.js'
import userMgr from "@/server/userUtil.js";
export default {
  data() {
    return {
        config:{},
    };
  },
  props: {},
  components: {
      "app-frame":()=>import('./frame.vue')
  },
  computed: {},
  watch:{},
  created() {},
  mounted() {
      let userObj = userMgr.getUser()
      let uid = userObj.id
      let id = "";
      let params = {}
      if(this.$route.query.ownApp){
        id = this.$route.query.ownApp;
        params.uid = uid
      }else{
        id = this.$route.query.publicApp;
        params.ownerShip = "PUBLIC"
      }
      
      serverApp.getApps(params).then(res=>{
        console.log(res)
        if(res.status==200){
          let arr = res.data
          arr.forEach(e => {
            if(e.id == id){
              e.plugins = e.plugins || [];
              // console.log(e,451212)
              this.config = e
              this.$route.meta.title = e.name
            }
          });
        }
        // this.plugins = res.list;
      });
  },
  methods: {}
};
</script>
<style lang='scss' scoped>
.cle:after {
    content: " ";
    display: block;
    width: 100%;
    clear: both;
  }
.detail{
  background-color: #f8f8f8;
  .leader{
    // margin-top: 1.55rem;
    padding: 1.023rem;
    &>b{
      float: left;
      font-size: 1.7689rem;
      color: #4c4c4c;
      font-weight: 600;
    }
    border-bottom: 1px solid #ccc;
  }
  .app-box{
    // height: calc(100% - 4rem);
    position: relative;
    width: 100%;
    // top: -50px;
  }
}
</style>