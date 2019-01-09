<template>
  <div class="map-vue">
    <div id="cesium"></div>
  </div>
</template>
<script>
import axios from "axios";
const psdeBaseUrl = "http://bt1.geosts.ac.cn/api";
const psdeHost = psdeBaseUrl + "/dae/datastore";
const psdeUrl = psdeHost + "/rest/v0.1.0/datastore/";

import map from "../jscript/cesiumMap/map";
import GlobalData from '../jscript/GlobalData'

import mapDataStore from '../jscript/dataStore/control/MapDataStore'
import StyleCtrl from '../jscript/dataStore/visualization/StyleCtrl'
export default {
  data() {
    return {};
  },
  props: {},
  components: {},
  computed: {},
  mounted() {
    map.createCesiumView(() => {
      console.log('请求数据')
      this.getColor();
    });
  },
  methods: {
     getColor() {
    let url = psdeUrl + '/oformstyle/query'
    axios.get(url, {
        params: {
          orderType: "ID",
          descOrAsc: true,
        }
      })
      .then((response) => {
        console.log(response.data.data);
        GlobalData.styleList = response.data.data.list
        StyleCtrl.setStyleList(response.data.data.list)
        this.getData()
      })
      .catch(function (error) {
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
        // loadAction: true, // 是否载入操作集合
        loadChildren: true,
        // geoEdit: true,
        sdomains: 6454047162368,
        uids: ""
      };
      axios
        .get(url, {
          params: obj
        })
        .then(response => {
          console.log(response.data.data);
          if (response.data.status == 200) {
            GlobalData.sobjectDatalist = response.data.data.list;
            // mapDataStore.createSobjectTile(response.data.data.list)
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
<style lang='scss' scoped>
.map-vue {
  width: 100%;
  height: 100%;
  #cesium {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>