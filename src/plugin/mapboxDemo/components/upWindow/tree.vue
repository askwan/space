
<template>
  <div class="upwindow" v-if="loading">
    <div class="object-tree">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
      <el-tree
      class="filter-tree"
        :data="GlobalData.treeList"
        highlight-current
        node-key="id"
        :props="defaultProps"
        :expand-on-click-node="false"
        ref="tree"
        :filter-node-method="filterNode"
        @node-contextmenu="rightEvent"
      >
      <span class="filter-tree-con" slot-scope="{node}">
          <i
            class="el-icon-view t-icon"
            :class="{click:!node.checked}"
            @click="checkboxchange(node)"
          ></i>
          <span class="t-con" @click="checkchange(node)">{{node.label}}</span>
        </span>
      </el-tree>
      <div
        v-show="showMenu"
        class="location"
        :style="{'top':posi.y+'px',
      'left':posi.x+'px'}"
        @click="selectMenu"
      >定位</div>
    </div>
  </div>
  <div v-else class="loading">
    <i class="el-icon-loading"></i>
  </div>
</template>
<script>
import "../../assets/public.scss";
import GlobalData from "../../jscript/GlobalData";
import { EventBus, MapEvent } from "../../jscript/event/Event.js";

let timer;
let data;
export default {
  data() {
    return {
      GlobalData,
      data: [],
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
  computed: {
    defaultCheckList(){
      return GlobalData.treeList.map(el => el.id);
    }
  },
  watch: {
    loading() {
      // this.data = GlobalData.treeList;
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {},
  mounted() {},
  methods: {
    checkboxchange(val) {
      val.checked = !val.checked;
      let show = !val.checked;
      let data = val.data;
      console.log(val);
      let have = -1;
      if(!GlobalData.disappearSobjectList){
        GlobalData.disappearSobjectList = []
      }
      GlobalData.disappearSobjectList.forEach((n, i) => {
        if (n == data.id) {
          have = i;
        }
      });
      if (have >= 0) {
        if (show) {
          GlobalData.disappearSobjectList.splice(have, 1);
        }
      } else {
        if (!show) {
          GlobalData.disappearSobjectList.push(data.id);
        }
      }
    },
   
    checkchange(val) {
      GlobalData.selectPick = val.data;
      let obj = {};
      EventBus.fire(MapEvent.LeftClick, obj);
    },
   
    rightEvent(event, obj, c, d) {
      event.stopPropagation();
      event.preventDefault();
      GlobalData.selectPick = obj;
      this.showMenu = true;
      console.log(event, obj);

      this.posi.x = event.pageX;
      if(this.$route.path == '/view'){
        this.posi.y = event.pageY - 55
      }else{
        this.posi.y = event.pageY - 175;
      }
      
      console.log(this.posi);
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.showMenu = false;
      }, 3000);
    },
    selectMenu() {
      EventBus.fire(MapEvent.RightClick, GlobalData.selectPick);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    }
  }
};
</script>
<style lang='scss' scoped>
.upwindow {
  .object-tree {
    height: 100%;
    position: relative;
    .filter-tree {
      .filter-tree-con {
        .t-icon {
          color: #fff;
          transition: all linear 0.1s;
        }
        .click {
          color: #409eff;
        }
        .t-con {
          margin-left: 5px;
        }
      }
    }
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