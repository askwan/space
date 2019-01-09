// import TimeLineBox from "@/Cesium/Widgets/TimeLineBox";
import map from "../cesiumMap/map";

import Vue from 'vue'
var vue = new Vue

var toolBarData = {};
toolBarData.setButtonList=[{
  name: "关系",
  val: "setRelation",
  show: false
},
{
  name: "退出历史",
  val: "exitHistory",
  show: true
  // }, {
  //   name: "退出轨迹",
  //   val: "exitTrajectory",
  //   show: true
},
],
toolBarData.pullList = [{
    name: "对象列表",
    val: "objectUi"
  }, {
    name: "类视图列表",
    val: "treeUi"
  }, {
    name: "历史版本",
    val: "historyUi"
  }, {
    name: "综合信息",
    val: "detailUi"
  }, {
    name: "模型平移",
    val: "modelTranslationUi"
  }],

  toolBarData.measurementList = {
    // Spatial: {
    //   name: "空间量算",
    //   val: "Spatial",
    //   show: true,
    // },
    // Stick: {
    //   name: "贴地量算",
    //   val: "Stick",
    //   show: false,
    // },
    ranging: {
      name: "测距",
      val: "Ranging",
      show: false,
    },
    // surface: {
    //   name: "测面",
    //   val: "surface",
    //   show: false,
    // },
    // heightFinding: {
    //   name: "测高",
    //   val: "HeightFinding",
    //   show: false,
    // },
    clear: {
      name: "取消",
      val: "clear",
      show: false,

    },
    delete: {
      name: "清除",
      val: "delete",
      show: false,

    }
  },
  toolBarData.measurementFun = (val, _this) => {
    let data = toolBarData.measurementList;
    for (let i in data) {
      let type = data[i]
      type.show = false;
      map.tool.tools.MeasurementManage.setSelectState(val)
      if (val == 'clear') {

      } else if (val == 'delete' && type.val == val) {
        map.tool.tools.MeasurementManage.clear()
      } else {
        if (val == type.val) {
          type.show = true;
        }
      }
    }
  }

toolBarData.measurementClear = () => {
  // map.operation.acquire = '';
}

toolBarData.fun = (name, _this) => {
  let ui = _this.$store.state.ui[name];
  let operate = ui.isShow ? "closeTab" : "openTab";
  _this.$store.commit(_this.MutationsList.openTab, {
    name: name
  });
}
toolBarData.tool = [{
    content: '搜索',
    icon: 'icon-sousuo',
    act: false,
    click: (_this, i) => {
      // console.log(_this)
      if (!_this.act) {
        _this.act = true;
        toolBarData.tool[i].act = true

      } else {
        _this.act = false;
        toolBarData.tool[i].act = false

      }
    }
  }, {
    content: '首页',
    icon: 'icon-iconfonthome0',
    act: false,

    click: (_this) => {
      map.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          113.665770, 34.751250, 10000000
        )
      });
    }
  }, {
    content: '时间轴',
    icon: 'icon-shijian',
    act: false,
    click: (_this) => {
      // let isShow, operate;
      // isShow = _this.$store.state.ui.timeLineUi.isShow;
      // operate = isShow ? "closeTab" : "openTab";
      // _this.$store.commit(_this.MutationsList[operate], {
      //   name: "timeLineUi"
      // });
      // _this.$store.commit(_this.MutationsList.compairLeft);
      // _this.isShow = !_this.isShow;
      // if (_this.isShow) {
      //   TimeLineBox.enable();
      // } else {
      //   TimeLineBox.disabled();
      // }
    }
  }, {
    content: '播放历史版本',
    icon: 'icon-bofangqi-bofangxiaodianshi',
    act: false,

    click: (_this) => {
      // _this.$store.commit(_this.MutationsList.openTimeVersion, {
      //   value: true
      // });
    }
  },
  //  {
  //   content: '获取轨迹',
  //   icon: 'icon-guiji',
  //   act: false,

  //   click: (_this) => {
  //     _this.$store.commit(_this.MutationsList.openTimeTrajectory, {
  //       value: true
  //     });
  //   }
  // },
  {
    content: '跟随目标',
    icon: 'icon-maijiagenzong',
    act: false,
    click: (_this, i) => {
      let model = map.getGlobalDataCurrentSelectObject()
      if (toolBarData.tool[i].act) {
        vue.$notify.info({
          title: '取消',
          message: '取消跟随选中模型',
        });
        toolBarData.tool[i].act = false
        map.follow.open = false
        map.follow.id = ''
        map.follow.uuid = ''
        map.setFollowOpen(false)
      } else {
        if (model.forms) {
          for (let q = 0; q < model.forms.length; q++) {
            let n = model.forms[q]
            if (n && n.type && n.type == 50) {
              vue.$notify({
                title: '跟随',
                message: '跟随选中模型',
                type: 'success'
              });
              toolBarData.tool[i].act = true
              map.follow.open = true
              map.follow.id = model.id
              map.follow.uuid = model.uuid
              map.setFollowOpen(true)

              return
            }
          }
          vue.$notify.error({
            title: '错误',
            message: '请先选中模型'
          });
        } else {
          vue.$notify.error({
            title: '错误',
            message: '请先选中模型'
          });
        }
      }
    }
  }, {
    content: '获取屏幕坐标',
    icon: 'icon-msnui-foresight',
    act: false,

    click: (_this) => {
      map.tool.setCurrent('PickCoordinate')
    }
  }, {
    content: '第一人称视角',
    icon: 'icon-ziyuan',
    act: false,
    click: (_this) => {
      map.theFirstPerspective.move();
    }
  }, {
    content: '量算',
    icon: 'icon-ziyuan1',
    act: false,
    click: (_this, i) => {
      if (!_this.measurementAct) {
        _this.measurementAct = true;
        toolBarData.tool[i].act = true
        map.tool.setCurrent('MeasurementManage')
      } else {
        _this.measurementAct = false;
        toolBarData.tool[i].act = false
        map.tool.tools.MeasurementManage.setSelectState('clear')
        map.tool.setCurrent('PickModel')
      }
    }
  }
]

export default toolBarData;
