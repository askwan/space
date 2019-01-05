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
        </el-carousel>
      </div>
    </div>
  </div>
</template>
<script>
import "./assets/public.scss";
import map from "./jscript/map";
import GlobalData from "./jscript/GlobalData";

export default {
  data() {
    return {
      loading: false,
      title: "中心机房",
      num: 3,
      false: false
    };
  },
  props: {},
  components: {
    cardBoxLa: () => import("./components/cardBox/cardBoxLeftA.vue"),
    cardBoxLb: () => import("./components/cardBox/cardBoxLeftB.vue"),
    cardBoxLc: () => import("./components/cardBox/cardBoxLeftC.vue"),
    cardBoxTree: () => import("./components/cardBox/cardBoxTree.vue"),

    cardBoxRa: () => import("./components/cardBox/cardBoxRightA.vue"),
    cardBoxRb: () => import("./components/cardBox/cardBoxRightB.vue"),
    cardBoxRc: () => import("./components/cardBox/cardBoxRightC.vue")
    // CTree: () => import("./components/tree.vue"),
    // CDetails: () => import("./components/details.vue")
  },
  computed: {},
  mounted() {
    console.log("--------------------------------------------------");
    map.init(() => {
      this.loading = true;
      this.$nextTick(() => {
        map.createMap();
      });
    });
  },
  methods: {}
};
</script>
<style lang='scss' scoped>
.map-three {
  background-color: #eee;
  .card {
    .c {
      height: 790px;
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