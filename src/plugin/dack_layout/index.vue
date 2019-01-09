<template>
  <div class="index-home">
    <move-box v-for="(n,i) in manage.uiManage.getManage()" :key="i" class="home-left" :title=n.title :name=n.name :status=n  :icon=n.icon>
      <component :is=n.ui></component>
    </move-box>

    <div class="home-middle" :style="{left:manage.uiManage.middleUi.left+'px',width:manage.uiManage.middleUi.width+'px',height:manage.uiManage.middleUi.height+'px'}">
      <component :is="manage.uiManage.middleUi.ui"></component>
      <div class="tool-list" :style="{right:manage.commonality.rightData.length>0?400+'px':100+'px'}">
        <div class="up-window" v-for="(n,i) in manage.upWindowTool" :key="i">
          <div class="grid" :class="{'on-click':n.show}">
              <i :class=n.icon @click="openPutDown(i)"></i>
          </div>
          <transition name="pulldown">
              <div class="up-list" v-if="n.show">
                  <div v-for="(q,w) in n.options" :key="w" @click="q.fn()">{{q.name}}</div>
              </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MoveBox from "./components/MoveBox";
import manage from "./manage/uiManage";
import config from "./config";
export default {
  data() {
    return {
      manage
    };
  },
  mixins: [config],
  props: ["plugins", "view","sdomain"],
  components: {
    MoveBox
  },
  computed: {},
  created() {},
  mounted() {
    // console.log(this.components.length);
    // console.log(this.manage.uiManage.getManage(),"43")
  },
  methods: {
    openUpWindow(name, w) {
      this.manage.uiFunction.openTab(name);
    },
    // ready(module) {
      
    // },
    openPutDown(i) {
      //打开下拉列表
      for(let j=0;j<this.manage.upWindowTool.length;j++){
        if(j != i){
          this.manage.upWindowTool[j].show = false
        }
      }
      this.manage.upWindowTool[i].show = !this.manage.upWindowTool[i].show;
    },
    initSize() {
      let bodyHeight, bodyWidth;

      let getSize = () => {
        bodyHeight = document.body.clientHeight;
        bodyWidth = document.body.clientWidth;

        let rightLeft = bodyWidth - 300; //最右
        let height = 500;
        this.manage.uiFunction.calcBody({
          width: bodyWidth,
          height: bodyHeight
        });

        //参数 name  top  left  width  height  show
        //rightLeft  就是在最右 0是最左
        this.leftOrRight("middle", 0, 0, bodyWidth, bodyHeight, true);
        // this.leftOrRight("left", 0, 0, 300, height, true);
        // this.leftOrRight("right", 0, rightLeft, 300, height, false);
        // this.leftOrRight("aaaa", 0, 0, 300, height, false);
        // this.leftOrRight("xxxx", 0, rightLeft, 300, height, false);
        // this.leftOrRight("dddd", 0, 0, 300, height, false);
      };
      document.body.onresize = () => {
        // console.log("改变")
        bodyHeight = document.body.clientHeight;
        bodyWidth = document.body.clientWidth;
        this.manage.uiFunction.calcBody({
          width: bodyWidth,
          height: bodyHeight
        });
      };
      getSize();
    },
    leftOrRight(name, top, left, width, height, show) {
      this.manage.uiFunction.updated({
        name: name,
        top: top,
        left: left,
        height: height,
        width: width,
        show: show
      });
    },
    uiReady(){
      console.log("readyUi")
    },
    pluginReady(){
      console.log('readyPlugin')
    }
  }
};
</script>
<style lang='scss' scoped>
.index-home {
  height: 100%;
  position: relative;
  .home-left {
    position: absolute;
    background-color: #333333;
  }
  .home-right {
    position: absolute;
    background-color: #333333;
  }
  .home-middle {
    position: absolute;
    height: 100%;
    background-color: #a39e9e;
    .tool-list {
      position: absolute;
      top: 30px;
      right: 100px;
      height: 40px;
      background-color: rgba(47, 53, 60, 0.8);
      .up-window {
        float: left;
        position: relative;
        width: 40px;
        height: 40px;
        text-align: center;
        .grid {
          & > i {
            line-height: 40px;
            width: 100%;
            color: #ffffff;
            font-size: 26px;
            transition: all linear 0.1s;
            cursor: pointer;
            &:hover {
              color: #409eff;
            }
          }
        }
        .on-click {
          & > i {
            color: #409eff;
          }
        }
        .up-list {
          position: absolute;
          top: 40px;
          left: 0;
          width: 100px;
          background-color: rgba(47, 53, 60, 0.7);
          & > div {
            color: #ffffff;
            font-size: 14px;
            height: 24px;
            line-height: 24px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
            transition: all linear 0.1s;
            &:hover {
              color: #409eff;
            }
          }
        }
      }
    }
  }
}

.pulldown-enter-active,
.pulldown-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1) 0s;
}

.pulldown-enter,
.pulldown-leave-to {
  transform: translateY(-40px);
  opacity: 0;
}
</style>