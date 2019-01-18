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
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  text-align: center;
  background-color: rgba(143, 174, 197, 0.3);
  .i-loading {
    margin-top: 400px;
    width: 40px;
    height: 40px;
    transition: all linear 0.1s;
    font-size: 40px;
    color: #ffe200;
  }
}
.location-show {
  // bottom: 100px;
}
</style>