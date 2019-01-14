let GlobalData = {

  sdomains: '', //时空域ID

  bodyWidth: 0,
  bodyHeight: 0,


  mapReady: false, //地图是否加载完毕
  queryReady: false, //请求是否完毕

  sobjectDatalist: [], //总数据
  sobjectTreelist: [], //总数据
  disappearSobjectList: [], //消失对象集合

  otypeList: [], //类试图
  disappearList: [], //消失类视图集合


  styleList: [], //样式列表
  formDict: '', //样式类型

  location: {
    lon: 0,
    lat: 0
  }, //鼠标当前坐标

  timelineShow: false, //时间轴的显示

  currentSelectObjectId: '', //选中id
  currentSelectObject: '', //选中sobject

  historyUpWindow: false, //播放历史弹窗是否打开
  historyOpen: false, //是否打开历史


  relationShow: false, //关系线总开关
  relationColor: {}, //关系线颜色

  setFollowOpen: false, //跟随状态

  pickModelNode: true, //点击模型是否整块获取
  pickModelId: null, //点击模型ID
  pickModelTranslation: {
    x: 50,
    y: 50,
    z: 50
  }, //点击模型平移距离

  upWindowShow: {
    objectUi: true,
    treeUi: true,
    historyUi: true,
    detailUi: true,
    modelTranslationUi: true
  },
  calcBody: (data) => {
    GlobalData.bodyWidth = data.width
    GlobalData.bodyHeight = data.height
  }
}
export default GlobalData