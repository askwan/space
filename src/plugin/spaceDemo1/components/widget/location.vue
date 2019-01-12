<template>
  <div
      class="location"
      :class="{'location-show':GlobalData.timelineShow}"
    >
      <div>经度：{{GlobalData.location.lon}}</div>
      <div>纬度：{{GlobalData.location.lat}}</div>
    </div>
</template>
<script>
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
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
  .location {
    position: absolute;
    bottom: 10px;
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
  .location-show {
    bottom: 110px;
  }
</style>