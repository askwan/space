<template>
  <div class="float">
    <div class="search-left all-left" :class="{'search-act':act}">
      <el-select
        class="search-select"
        popper-class="search-select-down"
        v-model="searchValue"
        filterable
        remote
        reserve-keyword
        placeholder="请输入关键词"
        :remote-method="remoteMethod"
        :loading="loading"
      >
        <el-option v-for="(item,i) in options" :key="i" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <i class="del iconfont icon-guanbi1" @click="del"></i>
    </div>
  </div>
</template>
<script>
const psdeBaseUrl = "http://bt1.geosts.ac.cn/api";
const psdeHost = psdeBaseUrl + "/dae/datastore";
const psdeUrl = psdeHost + "/rest/v0.1.0/datastore/";
// import { objectQuery } from "@/psde/objectService";
// import map from "@/script/map";
import axios from "axios";
import GlobalData from '../../../jscript/GlobalData'
import map from '../../../jscript/cesiumMap/map.js'
export default {
  data() {
    return {
      searchValue: "",
      options: [],
      loading: false
    };
  },
  props: ["act"],
  components: {},
  computed: {},
  watch: {
    searchValue() {
      this.options.forEach((n, i) => {
        if (n.id == this.searchValue) {
          let geoBox = n.geoBox;
          if (geoBox) {
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
          }
        }
      });
    }
  },
  mounted() {},
  methods: {
    del() {
      this.options = [];
      this.searchValue = "";
      this.$emit("floatFn", "");
    },
    remoteMethod(val) {
      if (val !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;

          let url = psdeUrl + "/object/query";
          axios
            .get(url, {
              params: {
                names: val,
                loadAttr: true,
                loadForm: true,
                loadObjType: true,
                orderType: "ID",
                descOrAsc: true,
                sdomains: GlobalData.sdomains
              }
            })
            .then(response => {
              console.log(response.data.data);
              this.options =  response.data.data.list;
            })
            .catch(function(error) {
              console.log(error);
            });
        }, 200);
      } else {
        this.options = [];
      }
    }
  }
};
</script>
<style scoped lang="scss" type="text/css">
.float {
  float: left;
  .all-left {
    width: 0;
    height: 0;
    overflow: hidden;
    transition: width 0.2s linear;
    position: relative;
    .del {
      font-size: 12px;
      color: #fff;
      position: absolute;
      top: 0;
      right: 5px;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
  }
  .search-act {
    width: 300px;
    height: 40px;
  }
}
</style>