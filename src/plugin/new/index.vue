<template>
  <div class="map-three fill">
    <div id="map" class="fill"></div>
    <div class="card">
      <div class="left-n c">
        <el-carousel trigger="click" height="96%" :autoplay="false" arrow="never">
          <el-carousel-item>
            <cardBoxTree :loading="loading"></cardBoxTree>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="right-n c">
        <el-carousel trigger="click" height="96%" :autoplay="false" arrow="never">
          <el-carousel-item>
              <cardBoxRa></cardBoxRa>
          </el-carousel-item>
          <el-carousel-item>
            <cardBoxRb :loading="loading"></cardBoxRb>
          </el-carousel-item>
           <el-carousel-item>
              <cardBoxRc></cardBoxRc>
          </el-carousel-item>
          <el-carousel-item>
              <cardBoxRd></cardBoxRd>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div> 
    <el-dialog
      title="图表"
      :visible.sync="dialogVisible"
      width="700px"
      :before-close="handleClose">
     <div id="echartMap" style="width:100%;height:350px;backgroundColor: #fff" v-if="dialogVisible"></div>
    </el-dialog>
    
  </div>
</template>
<script>
import "./assets/public.scss";
import map from "./jscript/map";
import GlobalData from "./jscript/GlobalData";
// import chart from './jscript/echartData/data.js';
// import echarts from '@/js/echarts.js';
import {EventBus,MapEvent} from './jscript/event/Event.js'
let echart
export default {
  data() {
    return {
      loading: false,
      title: "机房",
      num: 3,
      false: false,
      dialogVisible:false,

    };
  },
  props: {},
  components: {
    cards:()=>import('./components/cards.vue'),

    cardBoxTree: () => import("./components/cardBox/cardBoxTree.vue"),

    cardBoxRa: () => import("./components/cardBox/cardBoxRightA.vue"),
    cardBoxRb: () => import("./components/cardBox/cardBoxRightB.vue"),
    cardBoxRc: () => import("./components/cardBox/cardBoxRightC.vue"),
    cardBoxRd: () => import("./components/cardBox/cardBoxRightD.vue"),
    // CTree: () => import("./components/tree.vue"),
    // CDetails: () => import("./components/details.vue")
  },
  computed: {},
  watch:{},
  mounted() {
    console.log("--------------------------------------------------");
    map.init(() => {
      this.loading = true;
      this.$nextTick(() => {
        map.createMap();
      });
    });

   requirejs(
          [
            "/js/echarts.js"
          ],
          (echarts) => {
            echart=echarts
          }
        );

      EventBus.on(MapEvent.echartPic,data=>{
        if(data){
          this.dialogVisible = true
          this.$nextTick(()=>{
          data.data[data.pic]('echartMap',echart)
          })
        }
      })

  },
  methods: {
     handleClose(){
      this.dialogVisible = false
    }
  }
};
</script>
<style lang='scss' scoped>
.map-three {
  background-color: #eee;
  .card {
    .c {
      height: 92vh;
      width: 330px;
      position: absolute;
      top: 0px;
      margin-top: 20px;
    }
    .left-n {
      left: 10px;
    }
    .right-n {
      right: 10px;
    }
  }
}
</style>