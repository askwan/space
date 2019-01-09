
<template>
  <div class="objectUi" >
    <div class="object-tree">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
      <el-tree
        class="filter-tree"
        :data="GlobalData.sobjectDatalist"
        highlight-current
        :props="defaultProps"
        :expand-on-click-node="false"
        ref="tree"
        @node-click="checkchange"
        @node-contextmenu="rightEvent"
      ></el-tree>
      <div
        v-show="showMenu"
        class="location"
        :style="{'top':posi.y+'px',
      'left':posi.x+'px'}"
        @click="selectMenu"
      >定位</div>
    </div>
  </div>
  <!-- <div  class="loading">
    <i class="el-icon-loading"></i>
  </div> -->
</template>
<script>
// import "../../assets/public.scss";
import GlobalData from "../../jscript/GlobalData";
// import { EventBus, MapEvent } from "../../jscript/event/Event.js";

let timer;
// let data;
export default {
  data() {
    return {
      GlobalData,
    //   data: [],
      array:[],
      filterText: "",
      defaultProps: {
        children: "children",
        label: "name"
      },
      showMenu: false,
      posi: {
        x: 0,
        y: 0
      }
    };
  },
  props: {
    title: {
      type: [String]
    },
    num: {
      type: [Number]
    },
    state: {
      type: [Number]
    },
    loading: {
      type: [Boolean]
    }
  },
  components: {},
  computed: {},
  watch: {
    loading() {
    //   this.data = GlobalData.treeList;
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {},
  mounted() {
      console.log(this.data)
  },
  methods: {
    checkchange(a, b, c) {
    //   GlobalData.selectPick = a;
    //   console.log(a, b, c);
    //   let obj = {};
    //   EventBus.fire(MapEvent.LeftClick, obj);
    },
    rightEvent(event, obj, c, d) {
      event.stopPropagation();
      event.preventDefault();
      GlobalData.selectPick = obj;
      this.showMenu = true;
      console.log(event, obj);

      this.posi.x = event.clientX - 10;
      this.posi.y = event.clientY - 106;
      console.log(this.posi);
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.showMenu = false;
      }, 3000);
    },
    selectMenu() {
    //   EventBus.fire(MapEvent.RightClick, GlobalData.selectPick);
    console.log("定位111")
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    }
  }
};
</script>
<style lang='scss' scoped>
.objectUi {
  .object-tree {
    height: 100%;
    position: relative;
    .location {
      position: absolute;
      width: 70px;
      height: 30px;
      line-height: 30px;
      color: #000;
      background-color: #fff;
      border-radius: 3px;
      text-align: center;
      cursor: pointer;
      transition: all linear 0.1s;
      &:hover {
        color: #409eff;
      }
    }
  }
}
</style>