<template>
  <div class="tool-bar">
    <c-search :act="act" @floatFn="floatFn"></c-search>
    <div class="content">
      <div class="tool">
        <el-tooltip
          v-for="(n,i) in data.tool"
          :key="i"
          class="item"
          :class="{'act':n.act}"
          effect="dark"
          :content="n.content"
          placement="top"
          popper-class="tool-popper"
        >
          <i class="iconfont" :class="n.icon" @click="n.click(sthis,i)"></i>
        </el-tooltip>
      </div>
      <div class="menu" @mouseleave.stop="pullDown = false" @mouseenter.stop="pullDown=true">
        <el-tooltip effect="dark" content="菜单" placement="top" popper-class="tool-popper">
          <i class="iconfont icon-caidan"></i>
        </el-tooltip>
        <transition name="pullDowns">
          <div
            class="pullDown"
            v-show="pullDown"
            @mouseleave.stop="pullDown = false"
            @mouseenter.stop="pullDown = true"
          >
            <div v-for="(n,i) in data.pullList" :key="i" @click="data.fun(n.val,sthis)">{{n.name}}</div>
          </div>
        </transition>
      </div>

      <div class="menu" @mouseleave.stop="setSystem = false" @mouseenter.stop="setSystem=true">
        <el-tooltip effect="dark" content="设置按钮" placement="top" popper-class="tool-popper">
          <i class="iconfont icon-shezhi"></i>
        </el-tooltip>
        <transition name="pullDowns">
          <div
            class="pullDown"
            v-show="setSystem"
            @mouseleave.stop="setSystem = false"
            @mouseenter.stop="setSystem = true"
          >
            <div v-for="(n,i) in data.setButtonList" :key="i">
              <span v-if="n.val=='setRelation'">
                {{n.name}}
                <el-switch
                  v-model="n.show"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="setItem(n)"
                ></el-switch>
              </span>
              <span v-else @click="setItem(n)">{{n.name}}</span>
            </div>
          </div>
        </transition>
      </div>
              <c-measurement :act=measurementAct></c-measurement>

    </div>
  </div>
</template>
<script>
import map from "../../jscript/cesiumMap/map";
import toolBarData from "../../jscript/toolData/toolBarData";
import cMeasurement from "./floating/measurement";
import cSearch from "./floating/search";
import globalData from "../../jscript/GlobalData";

export default {
  data() {
    return {
      data: toolBarData,
      pulltimes: null,
      isShow: false,
      pullDown: false,

      setSystem: false,

      sthis: this,

      act: false,
      measurementAct: false
    };
  },
  props: {},
  components: {
    cSearch,
    cMeasurement
  },
  computed: {},
  watch: {},
  mounted() {
    // console.log(this.data);
  },
  methods: {
    floatFn(val) {
      this.act = val;
    },
    setItem(data) {
      if (data.val == "setRelation") {
        globalData.relationShow = data.show;
      }
      if (data.val == "exitHistory") {
        this.$notify({
          title: "成功",
          message: "已退出历史版本",
          type: "success"
        });
        this.historyClose();
      }
      // if (data.val == "exitTrajectory") {
      //   historyDataStroe.playbackClose("trajectory");
      // }
    },
    historyClose() {
      if (globalData.historyOpen == true) {
        console.log("历史关闭", 666666666);
        globalData.historyOpen = false;
        map.viewer.scene.render();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.tool-bar {
  position: absolute;
  top: 20px;
  right: 50px;
  color: #ffffff;
  height: 40px;
  line-height: 40px;
  align-items: center;
  background: rgba(47, 53, 60, 0.8);
  .content {
    float: right;
    .tool {
      float: left;
      height: 40px;
      line-height: 40px;
      align-items: center;
      i {
        margin: 5px 10px;
        cursor: pointer;
        font-size: 22px;
        color: #fff;
      }
      i:hover {
        color: #409eff;
      }
      .act {
        color: #409eff;
      }
    }
    .menu {
      float: left;
      height: 40px;
      line-height: 40px;
      align-items: center;
      position: relative;

      & > i {
        margin: 0 12px;
        cursor: pointer;
        font-size: 18px;
        color: #fff;
      }
      & > i:hover {
        color: #409eff;
      }
      .pullDown {
        position: absolute;
        top: 40px;
        left: -15px;
        width: 80px;
        background: rgba(47, 53, 60, 0.8);
        transition: all 0.1s linear 0s;
        z-index: 300;
        & > div {
          color: #fff;
          font-size: 14px;
          line-height: 30px;
          text-align: center;
          cursor: pointer;
          &:hover {
            color: #409eff;
          }
        }
        span {
          font-size: 14px;
          color: #fff;
        }
      }
    }
  }
}
.pullDowns-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1) 1s;
}

.pullDowns-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>