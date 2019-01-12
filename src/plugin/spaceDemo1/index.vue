<template>
  <div class="spaceDemo1">
    <c-map v-if="start"></c-map>

    <history-up-window></history-up-window>
    <c-loading v-if="!GlobalData.queryReady"></c-loading>
    <move-box
      v-for="(n,i) in manage.uiManage.getManage()"
      :key="i"
      class="home-left"
      :title="n.title"
      :name="n.name"
      :status="n"
    >
      <component :is="n.ui"></component>
    </move-box>
  </div>
</template>
<script>
import "./assets/time.scss";
import "./assets/icon.scss";
import "./assets/reset.scss";
import "./assets/public.scss";

import "@/../public/js/Cesium/Widgets/widgets.css";
import GlobalData from "./jscript/GlobalData";
import manage from "./jscript/manage/uiManage.js";
// import toolBArData from "./jscript/toolData/toolBarData.js";
import manage2 from "@/plugin/dack_layout/manage/uiManage.js";
import store from "./store";
export default {
  data() {
    return {
      GlobalData,
      manage,
      start: false,
      title: "对象树"
    };
  },
  props: {},
  components: {
    CMap: () => import("./components/map.vue"),

    HistoryUpWindow: () =>
      import("./components/toolList/floating/historyUpWindow.vue"),
    CLoading: () => import("./components/widget/loading.vue"),

    moveBox: () => import("./components/upWindow/MoveBox.vue"),

    tree: () => import("./components/upWindow/objTree.vue")
  },
  computed: {
    bodyWidths() {
      return manage2.commonality.bodyWidth;
    },
    bodyHeights() {
      return manage2.commonality.bodyHeight;
    }
  },
  watch: {
    bodyWidths() {
      this.updata();
    },
    bodyHeights() {
      this.updata();
    }
  },
  mounted() {
    console.log(manage2);
    console.log("===========================================");
    this.setSdomains();
    requirejs(["/js/Cesium/Cesium.js"], () => {
      requirejs(["/js/Cesium/viewerCesiumNavigationMixin.min.js"], () => {
        this.start = true;
        console.log("开始");
        this.initSize();
      });
    });
  },
  methods: {
    setSdomains(val) {
      GlobalData.sdomains = store.sdomains;
    },
    initSize() {
      let bodyHeight, bodyWidth;
      let obj = manage.uiManage.getManage();
      bodyHeight = document.body.clientHeight;
      bodyWidth = document.body.clientWidth;

      let rightLeft = bodyWidth - 300; //最右
      let mapBoxLeft = (bodyWidth - 800) / 2;
      let searchLeft = (bodyWidth - 600) / 2;
      let timeTop = bodyHeight - 100;
      let height = 500;

      GlobalData.calcBody({
        width: bodyWidth,
        height: bodyHeight
      });

      manage.uiFunction.calcBody({
        width: bodyWidth,
        height: bodyHeight
      });
      for (let i in obj) {
        let o = obj[i];
        manage.uiFunction.updated({
          name: o.name,
          show: false
        });
      }
    },
    updata() {
      let bodyHeight, bodyWidth;

      bodyHeight = document.body.clientHeight;
      bodyWidth = document.body.clientWidth;
      GlobalData.calcBody({
        width: this.bodyWidths,
        height: this.bodyHeights
      });
      manage.uiFunction.calcBody({
        width:  this.bodyWidths,
        height: this.bodyHeights
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.spaceDemo1 {
  min-width: 1200px;
  height: 100%;
  position: relative;
}
</style>