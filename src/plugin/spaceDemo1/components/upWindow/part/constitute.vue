<template>
  <div class="constitute">
    <div class="right-from-to" v-for="(n,i) in parents" :key="i">
      <span :title="aimObj.name">{{aimObj.name}}</span>
      <div>
        <div class="right-relation-pull">
          <div>
            <span>父</span>
            <!-- <span v-else>default</span> -->
          </div>
          <span></span>
          <!-- <i class="iconfont icon-zuojiantou"></i> -->
          <i class="el-icon-caret-right"></i>
        </div>
      </div>
      <span :title="n.name">{{n.name}}</span>
    </div>
  </div>
</template>
<script>
import GlobalData from "../../../jscript/GlobalData.js";

export default {
  data() {
    return {
      getNum: GlobalData,
      aimObj: "",
      parents: []
    };
  },
  props: {},
  components: {},
  computed: {},
  watch: {
    "getNum.currentSelectObjectId"() {
      this.parents = [];
      this.aimObj = this.getNum.currentSelectObject;
      let array = this.getNum.sobjectDatalist || [];
      array.forEach((n, i) => {
        let arr =  this.aimObj.parents || [];
        arr.forEach((q, w) => {
          if (n.id == q.id) {
            this.parents.push(n);
          }
        });
      });
      console.log(this.parents);
    }
  },
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.right-from-to {
  display: inline-block;
  vertical-align: top;
  > span {
    max-width: 85px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    user-select: none;
    color: #ffffff;
  }
  > span:hover {
    color: #409eff;
  }
  div {
    display: inline-block;
    vertical-align: top;
    margin-left: 3px;
    .right-relation-pull {
      position: relative;
      float: left;
      div {
        display: inline-block;
        position: absolute;
        left: 50%;
        top: -6px;
        transform: translateX(-55%);
        max-width: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span {
          color: #ffffff;
        }
      }
      > span {
        display: inline-block;
        width: 86px;
        height: 1px;
        margin-right: 7px;
        background: #999999;
        margin-top: 15px;
      }
      > i {
        font-size: 8px;
        color: #ffffff;
        position: absolute;
        top: 10px;
        right: 0px;
        width: 15px;
        height: 15px;
      }
    }
  }
}
</style>