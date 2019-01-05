<template>
    <div class="tree objTree">

        <el-tree
        :data="data"
        node-key="id"
        :highlight-current="true" 
        :props="defaultProps" 
        @node-click="handleNodeClick"
        @node-contextmenu="rightEvent"
        lazy 
        :load="loadNode" 
        >
        </el-tree>

        <ul class="contextmenu-list" :style="{left:formatPosi.x-30+'px',top:formatPosi.y-25+'px'}" v-show="showMenu">
            <li class="menu-btn" v-for="(menu,i) in menuList" @click="selectMenu" :key="i">{{menu.name}}</li>
        </ul>
    </div>
</template>
<script>
import { psdeApi } from "../psde/config";
import '../assets/public.scss'
let timer;
export default {
  data() {
    return {
      data: [],
      defaultProps: {
        label: "name",
        children: "children",
        isLeaf: "leaf"
      },
      posi: {
        x: 0,
        y: 0
      },
      menuList: [{ id: 0, name: "定位" }],
      rightFlyto: "",
      showMenu: false
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    formatPosi() {
      let obj = {
        x: this.posi.x,
        y: this.posi.y
      };
      return obj;
    }
  },
  methods: {
    ajaxData(obj) {
      var getToken =
        "eyJ1aWQiOjE5MDQ3LCJ0eXAiOiJKV1QiLCJjbGllbnRJZCI6IjliODI1ZTZkMTJmOTQzMTFiYjY4YTkwYzYwZjI1N2ZmIiwiYWxnIjoiSFMyNTYifQ.eyJuYmYiOjE1NDMyMTcxODMsImlzcyI6Imh0dHA6Ly93d3cuYmx1ZXRoaW5rLmNuIiwidHlwIjoiSldUIiwiZXhwIjoxNTQzMjI3OTgzLCJhbGciOiJIUzI1NiIsImlhdCI6MTU0MzIxNzE4M30.A-AuX-0eRsk77BZ6mlstIIiOO0pOb-efH8hiwE0eUrE";
      return new Promise((resolve, reject) => {
        psdeApi
          .get(`/object/query?token=${getToken}`, {
            params: obj
          })
          .then(res => {
            if (res.data.status === 200) {
            //   console.log(res.data.data.list, 123);
              res.data.data.list = res.data.data.list.map(el => {
                if (!el.name) {
                  el.name = "default";
                }
                return el;
              });
              // console.log(res.data.data.list)
              resolve(res.data.data.list)
              // // context.commit(MutationsList.objectList,res.data.data.list);
              // resolve(res.data.data);
            } else {
              reject();
            }
          });
      });
    },

    getData() {
      let obj = {
        parents: 0,
        pagenum: 1,
        pageSize: 300,
        orderType: "ID",
        // loadForm: true,
        descOrAsc: true
        // loadNetwork: true,
        // loadAction: true
      };
      this.ajaxData(obj).then(res=>{
              this.data = res;
      })
      
    },
    handleNodeClick(data, node, eve) {
      //左键
      // let par = {
      //     ids: data.id,
      //     loadAttr: true, // 是否加载属性信息
      //     loadForm: true, // 是否加载形态数据
      //     loadNetwork: true, // 是否加载关系
      //     loadModel: true, // 是否加载模型
      //     loadObjType:true,
      //     loadAction: true // 是否载入操作集合
      // };


      localStorage.setItem("ids",data.id)

      // objectQuery.query(par).then(res => {
      //     if (res.list && res.list[0]) {
      //     this.$store.commit(this.MutationsList.getClick, res.list[0]);
      //     globalData.currentSelectObjectId = data.id;
      //     globalData.currentSelectObject = res.list[0];
      //     }
      // });
    },
    rightEvent(event, obj, c, d) {
      // //右键 弹窗
      console.log(event, obj);
      event.stopPropagation();
      event.preventDefault();
      this.rightFlyto = obj;
      this.showMenu = true;
      this.posi.x = event.clientX;
      this.posi.y = event.clientY;
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.showMenu = false;
      }, 3000);
    },
    loadNode(node, resolve) {
      // console.log(node,resolve,"node")
      //懒加载
      if (node.level === 0) {
        return resolve(this.data);
      }
      let obj = {
        parents: node.data.id,
        pageNum: 1,
        pageSize: 300,
        orderType: "ID",
        // loadForm: true,
        descOrAsc: true
        // loadNetwork: true,
        // loadAction: true
      };
      this.ajaxData(obj).then(res=>{
          resolve(res)
      });
    },
    selectMenu() {
          //定位
          this.showMenu = false;
          let geoBox = this.rightFlyto.geoBox;
          if (geoBox.maxx == geoBox.minx && geoBox.maxy == geoBox.miny) {
              console.log(geoBox.minx,geoBox.miny)
            //   map.viewer.camera.flyTo({
            //   destination: Cesium.Cartesian3.fromDegrees(
            //       geoBox.minx,
            //       geoBox.miny,
            //       5000.0
            //   )
            //   });
          } else {
              console.log(geoBox.minx,geoBox.miny,geoBox.maxx,geoBox.maxy)
            //   map.viewer.camera.flyTo({
            //   destination: Cesium.Rectangle.fromDegrees(
            //       geoBox.minx,
            //       geoBox.miny,
            //       geoBox.maxx,
            //       geoBox.maxy
            //   )
            //   });
          }
    }
  }
};
</script>
<style lang="scss" scoped>

// .el-collapse-item__header{
//   background-color: #333;
//   color: #fff;
// }
// .el-collapse-item__content{
//    padding-bottom: 0px;
// }
// .el-collapse-item__content,.el-collapse-item__header{
//       background-color: #333;
//       color: #fff;
//       padding-left:10px;
//       border-bottom: 0px solid #ebeef5; 
//   }
//   .el-collapse-item__wrap{
//       background-color: #333;
//       border-bottom: 0px solid #ebeef5; 
//   }
//   .el-collapse-item__header.is-active {
//     border-bottom-color: transparent;
//   }
//   .el-collapse {
//    border-top: 0px solid #ebeef5; 
//    border-bottom: 0px solid #ebeef5; 
// }
  .contextmenu-list {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10000;
    overflow: hidden;
    border-radius: 3px;
  }
    .menu-btn {
      width: 80px;
      height: 30px;
      text-align: center;
      background-color: #fff;
      line-height: 30px;
      border-bottom: 1px solid #666;
      cursor: pointer;
    }
    .menu-btn:nth-last-of-type(1) {
      border: none;
    }
    .menu-btn:hover {
      background-color: #f3f3f3cc;
    }
</style>