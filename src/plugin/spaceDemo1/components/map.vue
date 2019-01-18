<template>
  <div
    class="map-vue"
    :class="{left:manage.commonality.leftData.length>0,right:manage.commonality.rightData.length>0}"
  >
    <div id="cesium" :class="{show:GlobalData.timelineShow}"></div>
    <c-location v-if="show"></c-location>
    <time-line></time-line>
    <tool-bar v-if="show"></tool-bar>
  </div>
</template>
<script>
import axios from "axios";
const psdeBaseUrl = "http://bt1.geosts.ac.cn/api";
const psdeHost = psdeBaseUrl + "/dae/datastore";
// const psdeHost='http://192.168.1.133:8001'
const psdeUrl = psdeHost + "/rest/v0.1.0/datastore/";

import map from "../jscript/cesiumMap/map";
import GlobalData from "../jscript/GlobalData";

import mapDataStore from "../jscript/dataStore/control/MapDataStore";
import StyleCtrl from "../jscript/dataStore/visualization/StyleCtrl";
import colorList from "../jscript/dataStore/visualization/colorList";

import manage from "../jscript/manage/uiManage";
import Sobject from "../jscript/dataStore/Sobject";
export default {
  data() {
    return {
      GlobalData,
      manage,
      show: false
    };
  },
  props: {},
  components: {
    CLocation: () => import("../components/widget/location.vue"),
    TimeLine: () => import("../components/timeLine/TimeLine.vue"),
    ToolBar: () => import("../components/toolList/ToolBar.vue")
  },
  computed: {},
  watch: {
    "GlobalData.bodyWidth"() {
      map.viewer.scene.render();
    },
    "GlobalData.bodyHeight"() {
      map.viewer.scene.render();
    }
  },
  mounted() {
    map.init(() => {
      console.log("请求数据");
      this.show = true;
      this.getP();
    });
  },
  methods: {
    getP() {
      let url = psdeUrl + "/sdomain/query";
      axios
        .get(url)
        .then(response => {
          console.log("时空域列表", response.data.data);
          let list = response.data.data.list;
          for (let i = 0; i < list.length; i++) {
            let l = list[i];
            if (GlobalData.sdomains == l.id) {
              map.flyTo(l);
            }
          }
          this.getOtype();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getOtype() {
      let url = psdeUrl + "/diagram/query";
      let obj = {
        loadField: true,
        loadModel: true,
        loadForm: true,
        loadParentField: true,
        loadParents: true,
        loadConnector: true,
        token: ""
      };
      axios
        .get(url, {
          params: obj
        })
        .then(response => {
          console.log("类视图", response.data.data);
          GlobalData.otypeList = response.data.data.list;
          GlobalData.otypeList.forEach((n, i) => {
            if (n.otypes.length > 0) {
              n.otypes.forEach((q, w) => {
                GlobalData.disappearList.push(q);
              });
            }
          });
          // GlobalData.disappearList = response.data.data.list;
          // StyleCtrl.setStyleList(response.data.data.list);
          this.getColor();
          this.getFormDict();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getColor() {
      let url = psdeUrl + "/oformstyle/query";
      axios
        .get(url, {
          params: {
            orderType: "ID",
            descOrAsc: true
          }
        })
        .then(response => {
          console.log("样式列表", response.data.data);
          GlobalData.styleList = response.data.data.list;
          StyleCtrl.setStyleList(response.data.data.list);
          colorList.setList(response.data.data.list);

          this.getData();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getFormDict() {
      let url =
        psdeUrl + `/dict/getDict/form?token=${sessionStorage.getItem("token")}`;
      axios
        .get(url, {
          params: {
            // orderType: "ID",
            // descOrAsc: true,
          }
        })
        .then(response => {
          GlobalData.formDict = response.data.data;
          // console.log(GlobalData.formDict)
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getData() {
      let url = psdeUrl + "/object/query";
      let obj = {
        loadAttr: true, // 是否加载属性信息
        loadForm: true, // 是否加载形态数据
        loadNetwork: true, // 是否加载关系
        loadModel: true, // 是否加载模型
        loadObjType: true,
        loadAction: true, // 是否载入操作集合
        loadChildren: true,
        // geoEdit: true,
        sdomains: GlobalData.sdomains,
        uids: ""
      };
      axios
        .get(url, {
          params: obj
        })
        .then(response => {
          console.log("总数据", response.data.data);
          if (response.data.status == 200) {
            console.log("请求结束");
            GlobalData.queryReady = true;
            let arr = [];
            for (let i = 0; i < response.data.data.list.length; i++) {
              let sobj = response.data.data.list[i];
              let newSobj = new Sobject(sobj);
              GlobalData.sobjectDatalist.push(newSobj);
              arr.push(newSobj);
            }
            this.getTreeList(arr);
            let modelList = [];
            // console.log(GlobalData.sobjectDatalist,'list');
            GlobalData.sobjectDatalist.forEach(object=>{
              let models = object.getModels();
              models.forEach(model=>{
                let index = modelList.find(el=>el==model.id);
                if(!index) modelList.push(model.id)
              })
            })
            console.log(modelList,'list');
            let ids = modelList.join(',');
            axios.get(psdeUrl+'/model/query?ids='+ids).then(res=>{
              console.log(res,'res')                
            })

            mapDataStore.createSobjectTile(GlobalData.sobjectDatalist);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getTreeList(list) {
      let parents = [];
      let child = [];
      list.forEach((n, i) => {
        if (n.parents.length < 1) {
          parents.push(n);
        } else {
          child.push(n);
        }
      });
      this.recursion(child, parents);
      this.sortUp(parents);
      GlobalData.sobjectTreelist = parents;
    },
    recursion(child, parents) {
      if (parents.length > 0) {
        parents.forEach((n, i) => {
          child.forEach((q, w, arr) => {
            if (n.id == q.parents[0].id) {
              n.children.push(q);
            }
          });
          this.recursion(child, n.children);
        });
      }
    },
    sortUp(list) {
      // console.log(list);
      list.forEach(sobj => {
        if (sobj.children && sobj.children.length > 0) {
          let child = [];
          sobj.children.forEach((n, i, arr) => {
            if (n.children.length > 0) {
              child.unshift(n);
            } else {
              child.push(n);
            }
          });
          sobj.children = child;
          this.sortUp(child);
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.map-vue {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  #cesium {
    width: 100%;
    height: 100%;
  }
  .show {
    height: calc(100% - 100px) !important;
  }
}

.right {
  right: 300px;
}
.left {
  left: 300px;
}
</style>