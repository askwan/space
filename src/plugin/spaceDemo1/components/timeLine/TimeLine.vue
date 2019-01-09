<template>
  <div class="TimeLine">
    <div id="time-line"></div>
  </div>
</template>
<script>
import map from "../../jscript/cesiumMap/map";
import TimeLineBox from '../../jscript/cesiumMap/TimelineBox/index'

export default {
  data() {
    return {};
  },
  props: {},
  components: {},
  computed: {},
  mounted() {
     TimeLineBox.init(map.viewer, 'time-line') // 加载时间轴
  },
  methods: {}
};
</script>
<style lang='scss' scoped>
.TimeLine{
   position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    color: #ffffff
}
</style>