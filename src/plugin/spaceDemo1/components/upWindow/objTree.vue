
<template>
  <div class="objectUi" v-if="GlobalData.sobjectTreelist.length>0">
    <div class="object-tree">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
      <el-tree
        class="filter-tree"
        :data="GlobalData.sobjectTreelist"
        highlight-current
        show-checkbox
        node-key="id"
        :props="defaultProps"
        :expand-on-click-node="false"
        ref="tree"
        :filter-node-method="filterNode"
        @node-click="checkchange"
        @node-contextmenu="rightEvent"
        :default-checked-keys="defaultCheckList"
        @check-change="checkboxchange"
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
  </div>-->
</template>
<script>
// import "../../assets/public.scss";
import GlobalData from "../../jscript/GlobalData";
// import { EventBus, MapEvent } from "../../jscript/event/Event.js";
import map from "../../jscript/cesiumMap/map";
let timer;
// let data;
export default {
  data() {
    return {
      GlobalData,
      // defaultCheckList: [],

      array: [],
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
      return GlobalData.sobjectTreelist.map(el => el.id);
    }
  },
  watch: {
    loading() {
      //   this.data = GlobalData.treeList;
    },
    filterText(val) {
      console.log(val);
      this.$refs.tree.filter(val);
    }
  },
  created() {},
  mounted() {
    // this.defaultCheckList = GlobalData.sobjectTreelist.map(el => el.id);
  },
  methods: {
    checkboxchange(a, b, c) {
      console.log(a, b, c);
      let have = -1;
      if (b) {
      } else {
      }
      GlobalData.disappearSobjectList.forEach((n, i) => {
        if (n == a.id) {
          have = i;
        }
      });
      if (have >= 0) {
        if (b) {
          GlobalData.disappearSobjectList.splice(have, 1);
        } else {
        }
      } else {
        if (b) {
        } else {
          GlobalData.disappearSobjectList.push(a.id);
        }
      }
    },
    checkchange(a, b, c) {
      //   GlobalData.selectPick = a;
      console.log(a, b, c);
      GlobalData.currentSelectObjectId = a.id;
      GlobalData.currentSelectObject = a;
    },
    rightEvent(event, obj, c, d) {
      event.stopPropagation();
      event.preventDefault();
      GlobalData.selectPick = obj;
      this.showMenu = true;
      console.log(event, obj);

      this.posi.x = event.layerX + 14;
      this.posi.y = event.layerY + 34;
      console.log(this.posi);
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.showMenu = false;
      }, 3000);
    },
    selectMenu() {
      this.showMenu = false;
      let geoBox = GlobalData.selectPick.geoBox;
      if (geoBox.maxx == geoBox.minx && geoBox.maxy == geoBox.miny) {
        map.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            geoBox.minx,
            geoBox.miny,
            5000.0
          )
        });
      } else {
        map.viewer.camera.flyTo({
          destination: Cesium.Rectangle.fromDegrees(
            geoBox.minx,
            geoBox.miny,
            geoBox.maxx,
            geoBox.maxy
          )
        });
      }
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