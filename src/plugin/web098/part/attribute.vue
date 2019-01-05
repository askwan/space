<template>
    <div>
        <div class='attribute upWindows' v-if="aimObj.attributes">
            <div class="title">对象ID：{{aimObj.id}}</div>
            <div class="up-ul">
                <div class="up-li">
                    <span>属性名</span>
                    <span>属性值</span>
                </div>
            </div>
            <div v-for="(n,i) in aimObj.attributes" :key="i" class="up-ul">
                <div class="up-li">
                    <span>{{n.name}}</span>
                    <span>{{n.value}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import getVal from "../psde/getData.js";
export default {
  data() {
    return {
        aimObj:[],
        getVal
    };
  },
  components: {},
  computed: {},
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
              this.aimObj = res[0];
            //   console.log(this.aimObj)
      })
      
    },
  }
};
</script>
<style scoped>
.upWindows{
  margin: 0px 10px 0px 10px;
  background: #545454;
}
.upWindows .title{
    font-size: 14px;
    line-height: 30px;
    border: 1px solid #737373;
    margin: -1px 0 0 -1px;
    background: #545454;
    color: #fff;
    text-align: center;
}
.up-ul .up-li{
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
}
.up-li span{
    flex: none;
    height: auto;
    line-height: 20px;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap !important;
    font-size: 12px;
    border: 1px solid #737373;
    margin: -1px 0 0 -1px;
    background: #545454;
    color: #fff;
    text-align: left;
    padding-left: 5px;
}
span:nth-child(1){
    width: calc(40% - 1px);
}
span:nth-child(2){
    width: calc(56% - 1px);
}
</style>