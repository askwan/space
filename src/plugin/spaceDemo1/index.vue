<template>
  <div class="spaceDemo1">
    <c-map v-if="start"></c-map>
    <div v-if="GlobalData.mapReady" class="location">
      <div>经度：{{GlobalData.location.lon}}</div>
      <div>纬度：{{GlobalData.location.lat}}</div>
    </div>
    <time-line v-if="GlobalData.mapReady"></time-line>
    <tool-bar v-if="GlobalData.mapReady"></tool-bar>

    <div class="space-card">
      <div class="left-s c">
        <el-carousel trigger="click" height="104%" :autoplay="false" arrow="never">
          <el-carousel-item>
            <cards :title="title">
              <tree></tree>
            </cards>
          </el-carousel-item>
          <!-- <el-carousel-item>
            <cards :title="title">
              <tree></tree>
            </cards>
          </el-carousel-item> -->
        </el-carousel>
      </div>
      <div class="right-s c">
        <el-carousel trigger="click" height="104%" :autoplay="false" arrow="never">
          <el-carousel-item>
              <!-- <cardBoxRa></cardBoxRa> -->
          </el-carousel-item>
        </el-carousel>
      </div>
    </div> 

  </div>
</template>
<script>
import "./assets/time.scss";
import "./assets/icon.scss";
import "./assets/reset.scss";
import "./assets/public.scss";

import "@/../public/js/Cesium/Widgets/widgets.css";
import GlobalData from "./jscript/GlobalData";

export default {
  data() {
    return {
      GlobalData,
      start:false,
      title:"对象树"
    };
  },
  props: {},
  components: {
    CMap: () => import("./components/map.vue"),
    TimeLine: () => import("./components/timeLine/TimeLine.vue"),
    ToolBar: () => import("./components/toolList/ToolBar.vue"),
    cards: () => import("./components/cards.vue"),
    tree: () => import("./components/upWindow/objTree.vue"),
    // classView: () => import("./components/upWindow/objTree.vue"),
  },
  computed: {},
  mounted() {
    // console.log(GlobalData)
    console.log("===========================================");
    requirejs(["/js/Cesium/Cesium.js"], () => {
      requirejs(["/js/Cesium/viewerCesiumNavigationMixin.min.js"], () => {
        this.start = true;
        console.log("开始");
      });
    });
  },
  methods: {}
};
</script>
<style lang='scss' scoped>
.spaceDemo1 {
  min-width: 1200px;
  height: 100%;
  position: relative;

  .location {
    position: absolute;
    bottom: 110px;
    right: 150px;
    width: 150px;
    background-color: rgba(47, 53, 60, 0.8);
    padding: 2px 5px;
    border-radius: 5px;
    & > div {
      font-size: 14px;
      color: #fff;
      text-align: left;
      line-height: 20px;
    }
  }
  .space-card {
    .c {
      height: 70vh;
      width: 330px;
      position: absolute;
      top: 50px;
      margin-top: 20px;
      background-color: rgba(47, 53, 60, 0.8);
    }
    .left-s {
      left: 10px;
    }
    .right-s {
      right: 10px;
    }
  }
}
</style>