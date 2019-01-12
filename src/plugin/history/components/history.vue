<template>
    <div class='history upWindows'>
        历史版本面板
        <div class='version-root'>
            <div class="version-head">

            </div>
            <div class="version-detail">
                <ul>
                    <li v-for="(item,index) in filterVersion(versionList)" :key="index">
                        <div class="version-left">
                            <div>
                                <span v-if="item.version && item.version.vid">V{{item.version.vid}}</span>
                                <span v-else>null</span>
                            </div>
                            <div>
                                <el-tooltip effect="dark" placement="bottom" v-if="item.version && item.version.vtime" :content="getTime(item.version.vid*1000)" popper-class="history-popper">
                                    <span>{{userCommon.TimeShift(item.version.vid*1000,4)}}</span>
                                </el-tooltip>
                                <el-tooltip effect="light" content="default" placement="bottom" popper-class="history-popper" v-else>
                                    <span>default</span>
                                </el-tooltip>
                            </div>
                        </div>
                        <div class="version-middle"></div>
                        <div class="version-right">
                            <div class="version-right-user">
                                <span v-if="item.version && item.version.user && item.version.user.userNickName">{{item.version.user.userNickName}}</span>
                                <span v-else>未知用户</span>
                            </div>
                            <div class="version-right-operation">
                                <div v-for="(it,ix) in item.aeData" :key="ix">
                                    <span v-if="it && it.reason">{{it.reason}}</span>
                                    <span v-else-if="it && it.operation">{{getOperationName(it.operation)}}</span>
                                    <span v-else>default</span>
                                </div>
                            </div>

                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import userCommon from "../script/userCommon.js";
import getVal from "../psde/getData.js";
export default {
  data() {
    return {
        userCommon,
        versionList: [],
        objectDetail:{}
    };
  },
  props: {},
  components: {},
  computed: {},
  watch:{
    objectDetail(val) {
      this.versionList = [];
      if (val) {
        console.log(val,200000)
        this.versionList = val.actions;
        // console.log(this.versionList)
      }
    }
  },
  created() {},
  mounted() {
      this.getData()
  },
  methods: {
    getData() {
    let ids = localStorage.getItem("ids")
      let par = {
          ids: ids,
          loadAttr: true, // 是否加载属性信息
          loadForm: true, // 是否加载形态数据
          loadNetwork: true, // 是否加载关系
          loadModel: true, // 是否加载模型
          loadObjType:true,
          loadAction: true // 是否载入操作集合
      };
      getVal.ajaxData(par).then(res=>{
          console.log(res[0],78979)
          this.objectDetail = res[0];
      })
    },

    filterVersion(data) {
      if (data && data.length > 0) {
        var arr = [];
        data.forEach((item, index) => {
          if (arr.length > 0) {
            var findIndex = arr.findIndex(
              it =>
                it.version &&
                it.version.vid &&
                it.version.vid == item.version.vid
            );
            if (findIndex > -1) {
              arr[findIndex].aeData.push(item.ae);
            } else {
              item.aeData = [];
              item.aeData.push(item.ae);
              arr.push(item);
            }
          } else {
            item.aeData = [];
            item.aeData.push(item.ae);
            arr.push(item);
          }
        });
        console.log(arr)
        return arr;
      } else {
        return data;
      }
    },
    getOperationName(val) {
      return val;
    },
    getTime(val) {
      console.log(val,this.userCommon)
      return (
        this.userCommon.TimeShift(val, 1).date +
        " " +
        this.userCommon.TimeShift(val, 1).time
      );
    }
  }
};
</script>
<style lang='scss' scoped>
.history {
//   padding: 0 20px;
}

.version-root {
  position: absolute;
  top: 34px;
  left: 0;
  bottom: 0;
  right: 0;
  background: #333333;
  overflow-y: auto;
  padding-left: 10px;
  width: 300px;
  .version-detail ul {
    position: relative;
    top: 10px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    li {
      display: flex;
      flex-direction: row;
      justify-content: center;
      margin-bottom: 10px;
      .version-left {
        width: 100px;
        padding-right: 5px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        div span {
          background-color: rgba(64, 158, 255, 0.1);
          display: inline-block;
          padding: 0 5px;
          height: 20px;
          line-height: 19px;
          font-size: 12px;
          color: #409eff;
          border-radius: 4px;
          box-sizing: border-box;
          border: 1px solid rgba(64, 158, 255, 0.2);
          white-space: nowrap;
          margin-bottom: 5px;
        }
        div:nth-child(2) span {
          color: #67c23a;
          border: 1px solid rgba(103, 194, 58, 0.2);
          background-color: rgba(103, 194, 58, 0.1);
        }
      }
      .version-middle {
        margin-top: 10px;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background: #67c23a;
        opacity: 0.8;
        z-index: 1;
      }
      .version-right {
        width: 188px;
        margin-left: -5px;
        padding-left: 10px;
        border-left: 1px solid #c2e7b0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        div span {
          color: #ffffff;
          font-size: 12px;
        }
        .version-right-user {
          margin-top: 10px;
        }
        .version-right-operation {
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>