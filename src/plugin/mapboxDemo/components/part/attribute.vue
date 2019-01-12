<template>
  <div class="attribute">
    <div class="updetail" v-if="aimObj.attributes">
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
import GlobalData from "../../jscript/GlobalData.js";
export default {
  data() {
    return {
      getNum: GlobalData,
      aimObj: []
    };
  },
  components: {},
  computed: {},
  watch: {
    "getNum.selectPick"() {
      this.aimObj = this.getNum.selectPick;
    }
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.updetail {
  margin: 0px 10px 0px 10px;
  background: #545454;
  .title {
    font-size: 14px;
    line-height: 30px;
    border: 1px solid #737373;
    margin: -1px 0 0 -1px;
    background: #545454;
    color: #fff;
    text-align: center;
  }
  .up-ul .up-li {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    &>span {
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
      &:nth-child(1) {
        width: calc(40% - 1px);
      }
      &:nth-child(2) {
        width: calc(56% - 1px);
      }
    }
  }
}

</style>