<template>
  <div class="inmap-loading" :class="{'location-show':GlobalData.timelineShow}">
    <transition name="el-fade-in-linear">
      <i class="el-icon-loading i-loading"></i>
    </transition>
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
.inmap-loading {
  position: absolute;
  bottom: 10px;
  left: 50%;
  width: 30px;
  height: 30px;
  .i-loading {
    transition: all linear 0.1s;
    font-size: 24px;
    color: #ffe200;
  }
}
 .location-show {
    bottom: 110px;
  }
</style>