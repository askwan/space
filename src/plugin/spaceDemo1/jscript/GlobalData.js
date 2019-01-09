let GlobalData = {
  mapReady: false, //地图是否加载完毕

  sobjectDatalist: [], //总数据
  styleList:[],//所有style
  
  location: {
    lon: 0,
    lat: 0
  }, //鼠标当前坐标

  currentSelectObjectId: '', //选中id
  currentSelectObject: '', //选中sobject

  historyOpen: false, //是否打开历史

  versionId: '', //如果版本开  保存在播放版本id

  loadingNum: 0, //请求发出去的个数

  showTreeArr: [], //类视图显示数组

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

  
}
export default GlobalData