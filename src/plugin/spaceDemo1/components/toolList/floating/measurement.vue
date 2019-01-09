
<template>
  <div class="measurement cle">
    <transition name="measurements">
      <div class="all-left measurement-left cle" v-show="act">
        <div
          class="sel"
          v-for="(n,i) in data.measurementList"
          :key="i"
          :class="{'measurement-click':n.show}"
          @click="data.measurementFun(n.val,sthis)"
        >{{n.name}}</div>
      </div>
    </transition>
  </div>
</template>
<script>
import toolBarData from "../../../jscript/toolData/toolBarData";

export default {
  data() {
    return {
      data: toolBarData,
      sthis: this
    };
  },
  props: ["act"],
  components: {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
};
</script>
<style scoped lang="scss" type="text/css">
.measurement {
  margin-top: 40px;
  .all-left {
    height: 40px;
    background: rgba(47, 53, 60, 0.8);
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  .measurement-left {
    float: left;
    padding-right: 5px;
    & > .sel {
      float: left;
      height: 24px;
      line-height: 18px;
      width: 60px;
      color: #fff;
      margin-left: 5px;
      margin-top: 7px;
      border: 1px solid #409eff;
      padding: 2px 4px;
      text-align: center;
      border-radius: 3px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s linear;
    }
    .measurement-click {
      background-color: #409eff;
    }
  }

  .measurements-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1) 0s;
  }

  .measurements-leave-to {
    transform: translateY(-10px);
    opacity: 0;
  }
}
</style>