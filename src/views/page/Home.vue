<template>
  <div class="home">
    <!-- <canvas id="J_dotLine" style="background-color: rgba(204, 201, 201, 0.726);width:100%;height:100%"></canvas> -->
    <!-- <div class="header" id="demo">
        <div class="canvaszz"> </div>
        <canvas id="canvas"></canvas>
    </div> -->
    <div class="content">
      <!-- <div class="leader cle">
        <b>App</b>
        <div class="tab-but">
          <el-button type="primary" @click="jump()" plain>创建App</el-button>
        </div>
      </div> -->
      <div class="con cle">
        <div class="tab-but">
          <el-button type="primary" @click="jump()" plain>创建App</el-button>
        </div>
        <!-- tab页 -->
        <el-tabs v-model="activeName">
          <el-tab-pane v-for="(n,i) in tabObj" :key="i" :label="n.tab" :name="n.name">
            <div class="cell-container">
              <ul class="cle">
                <li class="item-card" v-for="(app,q) in n.data" :key="q">
                  <div class="item-con cle">
                    <!-- img -->
                    <div class="ember-view">
                      <img :src="app.icon" v-if="app.icon">
                      <img v-else src="./assets/images/img.png">
                    </div>
                    <div class="app-info">
                      <div class="alone" :title="app.name" @click="view(app)">{{app.name}}</div>
                      <h6>{{app.ownerShip}}</h6>
                    </div>
                  </div>
                  <div class="center-card">
                    <div class="alone"
                      v-if="app.layout"
                      :title="'ui：'+app.layout"
                    >
                    <span class="c-ui ">{{app.layout}}
                      </span>
                      </div>
                    <div v-else></div>
                    <div class="alone"
                      v-if="app.mapView"
                      :title="'场景：'+app.mapView"
                    >
                    <span class="c-mapView">{{app.mapView}}</span>
                    </div>
                    <div v-else></div>

                    <div class="alone"
                      v-if="app.sdomain&&app.sdomain.id"
                      :title="'时空域：'+app.sdomain.name"
                    >
                    <span class="c-sdomain">{{app.sdomain.name}}</span>
                    </div>
                    <div v-else></div>

                    <div v-if="app.layout" title="创建日期" class="createTime">{{app.createTime|editTime}}</div>
                  </div>

                  <div class="mask">
                    <i
                      class="el-icon-edit"
                      title="编辑插件"
                      @click="edit(app)"
                      v-if="app.uid == userId.id"
                    ></i>
                    <i
                      class="el-icon-edit-outline"
                      title="编辑app"
                      @click="editApp(app)"
                      v-if="app.uid == userId.id"
                    ></i>
                    <i
                      class="el-icon-delete"
                      title="删除"
                      @click="delet(app)"
                      v-if="app.uid == userId.id"
                    ></i>
                  </div>
                </li>
              </ul>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import { serverApp } from "@/server/index.js";
import userMgr from "@/server/userUtil.js";
import { readyServer, pluginServer } from "@/localServer";
import background from "../../script/background.js";

export default {
  data() {
    return {
      tabObj: {
        own: {
          tab: "我的应用",
          name: "own",
          data: []
        },
        public: {
          tab: "应用大厅",
          name: "public",
          data: []
        }
      },

      lists: [],
      activeName: "own",
      params: {},
      userId: userMgr.getUser(),
      publicApp: [],
      ownApp: []
    };
  },
  props: {},
  components: {},
  computed: {},
  filters: {
    editTime(timestamp) {
      var date = new Date(timestamp);
      var Y = date.getFullYear() + "年";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "月";
      var D = date.getDate() + "日";
      // var h = date.getHours() + ':';
      // var m = date.getMinutes() + ':';
      // var s = date.getSeconds();
      return Y + M + D;
    }
  },
  mounted() {
    // background.start();

    // background.rotate()

    this.init();
    console.log(this.tabObj);
  },
  methods: {
    init() {
      this.getApps({ ownerShip: "PUBLIC" });
      let uid = this.userId.id;
      this.params.uid = uid;
      this.getApps({ uid: uid });
    },
    //请求
    getApps(param) {
      serverApp.getApps(param).then(res => {
        if (res.status == 200) {
          let lists = [];
          if (param.ownerShip) {
            this.tabObj.public.data = res.data.reverse();
          } else {
            this.tabObj.own.data = res.data.reverse();
          }
        }
      });
    },
    view(app) {
      console.log(app);
      if (app.uid == this.userId.id) {
        window.open("#/view?ownApp=" + app.id);
      } else {
        window.open("#/view?publicApp=" + app.id);
      }
    },
    jump() {
      this.$router.push("/create");
    },
    delet(app) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // console.log(app.id)
          let id = app.id;
          serverApp.deleteApp({ id: id }).then(res => {
            if (res.status == 200) {
              // console.log(res)
              this.lists = this.lists.filter(el => el.id != app.id);
              // location.reload()
              this.init();

              this.$notify({
                type: "success",
                title: "成功",
                message: "删除成功"
              });
            }
          });
        })
        .catch(() => {});
    },
    edit(app) {
      this.$router.push({
        path: "/detail",
        query: {
          new: app.id
        }
      });
      // window.open('#/detail?new='+app.id)
    },
    editApp(app) {
      this.$router.push({
        path: "/create",
        query: {
          edit: app.id
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
body {margin:0 auto;overflow:hidden;}  
.header canvas {
	width:100%;height:auto/*默认全屏显示 可自己设置高度640px*/;
	display:inline-block;vertical-align:baseline;
	position:absolute;
	z-index:-1;
    }
.header .canvaszz{  /*用来解决视频右键菜单，用于视频上面的遮罩层*/
    width:100%;
    // background-image: url("./assets/images/in_top_bj.jpg");
    height:640px;
    position:absolute;
    z-index:0;//10
        filter:alpha(opacity=40);  
            -moz-opacity:0.4;  
            -khtml-opacity: 0.4;  
            opacity: 0.4;
    }
.home {
  position: relative;
  .content {
    position: absolute;
    top: 0;
    left: calc(50% - 600px);
    width: 1200px;
    // margin: 0 auto;
    background-color: #f8f8f8;
    // background-color: transparent;

    // .leader {
    //   padding: 10px 10px;
    //   border-bottom: 1px solid #ccc;
    //   & > b {
    //     float: left;
    //     font-size: 30px;
    //     // color: #2a5cad;
    //   }
    //   & > .tab-but {
    //     float: right;
    //   }
    // }
    .con {
      padding: 0 0 20px 0;
      .tab-but{
        position: absolute;
        right: 22px;
        top: 3px;
        z-index: 1;
        .el-button{
          padding: 8px 20px;
        }
      }
      .cell-container {
        height: 810px;
        overflow-y: auto;
        & > ul {
          .item-card {
            float: left;
            width: 220px;
            border: 1px solid #ccc;
            // color: #066197;
            background-color: rgba(255, 255, 255, 0.8);
            // background: linear-gradient(#2a5cad, #eee);
            margin-right: 10px;
            margin-bottom: 10px;
            margin: 6px 4px;
            padding-bottom: 5px;
            transition: all linear 0.2s; 
            .item-con {
              padding-top: 5px;
              .ember-view {
                float: left;
                width: 62px;
                height: 62px;
                & > img {
                  margin-left: 5px;
                  width: 100%;
                  height: 100%;
                  border-radius: 6px;
                }
              }
              .app-info {
                margin-left: 77px;
                margin-top: 10px;
                & > div {
                  width: 120px;
                  font-size: 16px;
                  font-weight: 600;
                  cursor: pointer;
                  &:hover {
                    text-decoration: underline;
                    // color: #409EFF;
                  }
                }
                & > h6 {
                  padding-top: 10px;
                  color: #808080;
                  font-size: 12px;
                  font-weight: 400;
                }
              }
            }
            .center-card {
              color: #6e6e6e;
              padding: 10px 10px 0 10px;
              & > div {
                margin-top: 3px;
                // padding:2px;
                height: 24px;
                max-width: 198px;
                // max-width: 198px;
                text-align: left;
                font-weight: 400;
                font-size: 14px;
                line-height: 24px;
                &>span{
                    padding: 2px 3px;

                border-radius: 3px;

                }
              }
              .createTime{
                font-size: 12px;
                text-align: center;
              }
              .c-ui {
                color: #67c23a;
                background: #f0f9eb;
                border: 1px solid #c2e7b0;
              }
              .c-mapView {
                color: #e6a23c;
                background: #fdf6ec;
                border: 1px solid #f5dab1;
              }
              .c-sdomain {
                color: #f56c6c;
                background: #fef0f0;
                border: 1px solid #fbc4c4;
              }
            }

            .mask {
              height: 26px;
              text-align: center;
              & > i {
                padding: 5px 10px 5px 10px;
                color: #6e6e6e;
                font-size: 16px;
                cursor: pointer;
                &:hover {
                  color: red;
                }
              }
              .el-icon-delete {
                color: #f56c6c;
              }
            }
            &:hover{
              box-shadow: 0 0 5px 2px rgba($color: #111, $alpha: 0.1);
            }
          }
        }
      }
    }
  }
}
.cle:after {
  content: " ";
  display: block;
  width: 100%;
  clear: both;
}
.alone {
  //单行省略号
  overflow: hidden;
  text-overflow: ellipsis; //省略号
  white-space: nowrap; //用不换行
  display: block;
}
</style>