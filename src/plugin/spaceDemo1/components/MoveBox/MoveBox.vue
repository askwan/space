<template>
  <transition :name="animate">
      <div ref="moveBox" 
      class='move-box'
      :style="{top:status.top+'px',left:status.left+'px',width:status.width+'px',height:status.height+'px','z-index': commonality.pitchObj==name?400:status.zIndex}"
      v-if="status.show">
        <div class="move-nav" @mousedown.prevent.stop="beginMove" >
          <span :title="title">{{title}}</span>
          <i class="el-icon-close" @click="closeTab"></i>
        </div>

        <div v-if="status.show && status.left==0 && commonality.leftData.length!=0" class="box-title box-title-left pd-top-small" :style="{top:status.titleNum+'px',right:-52+'px' }" :class="{'box-title-click':commonality.leftDataIndex==name}" @mousedown.prevent.stop="beginMoves"><i :class=icon></i><div >{{title}}</div></div>

        <div v-if="status.show && bodyWidth-status.left-status.width==0 && commonality.rightData.length!=0" class="box-title box-title-right pd-top-small" :style="{top:status.titleNum+'px',left:-52+'px' }"  :class="{'box-title-click':commonality.rightDataIndex==name}" @mousedown.prevent.stop="beginMoves"><i :class=icon></i><div >{{title}}</div></div>

        <div class="box-content" :style="{height:(status.height-35)+'px'}" @scroll="boxScroll">
          <slot></slot>
        </div>
        <div class="sign" @mousedown="resetSize($event,true)"></div>
        <div class="resize" @mousedown="resetSize($event,false)"></div>
      </div>
  </transition>
</template>
<script>
let beginLeft = 0;
let beginTop = 0;
let posiLeft = 0;
let posiTop = 0;
let resetSX = 0;
let resetSY = 0;
let orgHeight = 0;
let orgWidth = 0;
let downX
let downY
import manage from "../../jscript/manage/uiManage.js";

export default {
  data() {
    return {
      manage,
      //移动
      isMove: false,
      //调整大小
      isResize: false,

      isTitle: false
    };
  },
  props: {
    name: [String],
    status: [Object],
    title: {
      type: String
    },
    animate: {
      type: String,
      default: "left"
    },
    icon:{
      type: String,
    }
  },
  components: {},
  computed: {
   
    bodyWidth() {
      return this.manage.commonality.bodyWidth;
    },
    commonality() {
      return this.manage.commonality;
    }
  },
  mounted() {
  },
  methods: {
    pitch() {
      // console.log(this.icon)
      this.manage.uiFunction.pitch(this.name);
    },
    //按下移动
    beginMove(event) {
      this.isMove = true;
      this.isTitle = false;
      this.beginBox(event);
    },
  
    beginMoves(event) {
      this.isMove = true;
      this.isTitle = true;
      this.beginBox(event);
    },
    
    beginBox(event) {
      this.pitch()

      downX=event.screenX
      downY=event.screenY
      //记录按下时鼠标居左和居上的值
      beginLeft = event.clientX;
      beginTop = event.clientY;
      //box居左和居上的值
      posiLeft = this.$refs.moveBox.offsetLeft;
      posiTop = this.$refs.moveBox.offsetTop;

      this.manage.uiFunction.updated({
        name: this.name,
        left: posiLeft,
        top: posiTop,
        width: this.status.width,
        height: this.status.height,
        show: true
      });
      //添加移动和松开鼠标事件
      window.addEventListener("mouseup", this.closeMove);
      window.addEventListener("mousemove", this.moveBox);
    },
    moveBox(event) {
      // console.log(event,567567)
      let X=event.screenX;
      let Y=event.screenY;
      if(!(Math.abs(X-downX)>2||Math.abs(Y-downY)>2)){
        return
      }
      //是否在移动状态
      if (!this.isMove) return;
      //两个参数是移动变化的像素
      let x = event.clientX - beginLeft;
      let y = event.clientY - beginTop;
      let calcTop = posiTop + y;
      let calcLeft = posiLeft + x;
      if (this.isTitle) {
        let width = this.$refs.moveBox.offsetWidth;
        let height = this.$refs.moveBox.offsetHeight;
        this.manage.uiFunction.updated({
          name: this.name,
          left: event.clientX - width / 2,
          top: event.clientY - 10,
          width: this.status.width,
          height: this.status.height,
          show: true
        });
      } else {
        this.manage.uiFunction.updated({
          name: this.name,
          left: calcLeft,
          top: calcTop,
          width: this.status.width,
          height: this.status.height,
          show: true
        });
      }

    },
    closeMove(event) {
      this.manage.uiFunction.updated({
          name: this.name,
        });
      // this.manage.uiFunction.setZIndex(this.name,400);
      //松开鼠标  改变移动状态
      this.isMove = false;
      //清除移动和松开鼠标事件
      window.removeEventListener("mouseup", this.closeMove);
      window.removeEventListener("mousemove", this.moveBox);
    },

    closeTab() {
      //关闭按钮
      this.manage.uiFunction.closeTab(this.name);
    },

    resetSize(event, bool) {
      this.isResize = true;
      //鼠标居上左距离
      resetSX = event.clientX;
      resetSY = event.clientY;
      //box的宽高
      orgHeight = this.status.height;
      orgWidth = this.status.width;
      if (bool) {
        //调整大小
        window.addEventListener("mousemove", this.resetMove, false);
      } else {
        //调整高度
        window.addEventListener("mousemove", this.resetHeight, false);
      }
      //松手
      window.addEventListener("mouseup", this.closeResize);
    },
    //调整高度
    resetHeight(event) {
      if (!this.isResize) return;
      //当前鼠标居上-开始鼠标居上+box的高=新高度
      let calcHeight = event.clientY - resetSY + orgHeight;
      this.manage.uiFunction.updated({
        name: this.name,
        width: this.status.width,
        height: calcHeight,
        left: this.status.left,
        top: this.status.top,
        show: true
      });
      this.manage.uiFunction.setOldData({
        name: this.name,
        oldData: {
          width: this.status.width,
          height: calcHeight
        }
      });
    },
    //调整大小
    resetMove(event) {
      if (!this.isResize) return;
      //当前鼠标居左-开始鼠标居左+box的宽=新宽度
      let calcWidth = event.clientX - resetSX + orgWidth;
      //当前鼠标居上-开始鼠标居上+box的高=新高度
      let calcHeight = event.clientY - resetSY + orgHeight;
      this.manage.uiFunction.updated({
        name: this.name,
        width: calcWidth,
        height: calcHeight,
        left: this.status.left,
        top: this.status.top,
        show: true
      });
      this.manage.uiFunction.setOldData({
        name: this.name,
        oldData: {
          width: calcWidth,
          height: calcHeight
        }
      });
    },
    //调整结束
    closeResize() {
      this.isResize = false;
      window.removeEventListener("mousemove", this.resetMove);
      window.removeEventListener("mousemove", this.resetHeight);
      window.removeEventListener("mouseup", this.closeResize);
    },
    boxScroll(event) {
      // this.$emit("scroll", event);
    }
  }
};
</script>
<style scoped lang="scss">
.move-box {
  position: absolute;
  outline: 1px solid #999999;
  user-select: none;
  outline:none;

  .move-nav {
    width: 100%;
    height: 34px;
    cursor: move;
    background-color: rgba(47, 53, 60, 1);
    & > span {
      display: inline-block;
      line-height: 35px;
      font-size: 16px;
      font-weight: 500;
      padding-left: 12px;
      color: #ffffff;
      width: 85%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    & > i {
      cursor: pointer;
      float: right;
      margin-top: 5px;
      color: #fff;
      font-size: 16px;
      margin-right: 5px;
      transition: all linear 0.1s;
      &:hover {
        font-size: 18px;
        color: #ffffff;
      }
    }
  }
  .box-title {
    position: absolute;
    z-index: 0;
    width: 50px;
    height: 60px;
    line-height: 30px;
    font-size: 12px;
    color: #fff;
    background-color: rgba(51, 51, 51, 1);

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    // text-indent: 10px;
    // padding-right: 5px;
    text-align: center;
    transition: all linear 0.2s;
    padding-top:10px;
    &>div{
      font-size: 12px;
    }
  }
  .box-title-left {
    border-bottom-right-radius: 3px;
    border-top-right-radius: 3px;
  }
  .box-title-right {
    border-bottom-left-radius: 3px;
    border-top-left-radius: 3px;

  }
  .box-title-click {
    transform: scale(1.05);
    color: #fff;
    // background-color: #409eff;
    background-color:#3778bb;
  }
  .box-content {
    padding: 10px;
    color: #fff;
    overflow-x: auto;
    overflow-y: auto;
    background-color: rgba(51, 51, 51, 1);
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(255, 255, 255, 0.9);
      &:hover {
        background: rgba(105, 105, 105, 0.9);
      }
    }
    &::-webkit-scrollbar-track-piece {
      /*滚动条里面轨道*/
      // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      // border-radius: 10px;
      background: rgba(51, 51, 51, 0.9);
    }
  }
  .sign {
    width: 8px;
    height: 8px;
    background-color: #e0e0e0;
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 200;
    cursor: se-resize;
  }
  .resize {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 5px;
    cursor: n-resize;
  }
}


.left-enter-active,
.left-leave-active {
  transition: all 0.1s;
}
.left-enter,
.left-leave-to {
  width: 0 !important;
}
.top-enter-active,
.top-leave-active {
  transition: all 0.2s;
}
.top-enter,
.top-leave-to {
  height: 0 !important;
}
.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s;
}
.scale-enter,
.scale-leave-to {
  transform: scale(0, 0) !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0 !important;
}
.right-enter-active,
.right-leave-active {
  transition: all 0.1s;
  opacity: 0;
  /*overflow: hidden;*/
}
.right-enter,
.right-leave-to {
  transform: translateX(100%);
}


</style>