<template>
  <div class="TimeLine" v-show="GlobalData.timelineShow">
    <div id="time-line"></div>
  </div>
</template>
<script>
import map from "../../jscript/cesiumMap/map";
import TimeLineBox from "../../jscript/cesiumMap/TimelineBox/index";
import GlobalData from "../../jscript/GlobalData";

export default {
  data() {
    return {
      GlobalData
    };
  },
  props: {},
  components: {},
  computed: {},
  watch: {
    "GlobalData.timelineShow"(val) {
      console.log(11111,val)
      if (val) {
        TimeLineBox.init(map.viewer, "time-line"); // 加载时间轴

        TimeLineBox.enable();
      } else {
        TimeLineBox.disabled();
      }
    }
  },
  mounted() {
    setTimeout(() => {
      TimeLineBox.init(map.viewer, "time-line"); // 加载时间轴
      TimeLineBox.resize();
      GlobalData.TimeLineBox=TimeLineBox
    }, 100);
  },
  methods: {}
};
</script>
<style lang='scss' scoped>
.TimeLine {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  color: #ffffff;
}
</style>