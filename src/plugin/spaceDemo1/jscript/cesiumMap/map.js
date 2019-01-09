import clock from './clock/clock';
import GlobalData from '../GlobalData'

import CesiumEventListener from '../event/CesiumEventListener'
import Location from '../operation/Location'
import TheFirstPerspective from '../operation/theFirstPerspective'
// import Follow from '../operation/follow'
import Tool from '../tools/Tool'



class Map {
  constructor() {
    this.id = 'cesium'

    this.behaviorLists={}//行为

    this.measurementPolyline={}//量算
    this.measurementLabel={}//量算
  }
  init() {

  }

  createCesiumView(fn) { // 创建cesium视图
    this.viewer = new Cesium.Viewer(this.id, {
      clockViewModel: clock.getClockViewModel(),
      clock: clock,
      timeline: false, // 是否显示时间轴 
      animation: false, // 是否创建动画小器件，左下角仪表 
      requestRenderMode: false, // 启用请求渲染模式
      scene3DOnly: true, // 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源 
      navigationHelpButton: false, // 是否显示右上角的帮助按钮 
      navigationInstructionsInitiallyVisible: false,
      fullscreenButton: false, // 是否显示全屏按钮 
      geocoder: false, // 是否显示geocoder小器件，右上角查询按钮 
      homeButton: false, // 是否显示Home按钮 
      selectionIndicator: false, // 是否显示选取指示器组件 
      sceneModePicker: false, // 是否显示3D/2D选择器 
      baseLayerPicker: false, // 是否显示图层选择器 

      // shadows: true, // 确定阴影是否由太阳投射。
      // skyAtmosphere: true, //蓝天，以及地球四肢周围的辉光。设置为false关闭。
      imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
        url: 'http://www.google.cn/maps/vt?lyrs=s@726&gl=cn&x={TileCol}&y={TileRow}&z={TileMatrix}',
        // url: 'http://192.168.1.102:3000/style/{TileMatrix}/{TileCol}/{TileRow}.png?id=tmstyle://e:/data/aa.tm2&j45ogek3',
        // url: 'http://localhost:3000/style/{TileMatrix}/{TileCol}/{TileRow}.png?id=tmstyle://e:/data/aaa.tm2&j45om8vq',
        layer: 'USGSShadedReliefOnly',
        style: 'default',
        format: 'image/png',
        tileMatrixSetID: 'default028mm',
        maximumLevel: 19,
        credit: new Cesium.Credit('bluethink')
      })
    })
    // 设置鼠标操作改变
    this.viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH]
    this.viewer.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.PINCH, Cesium.CameraEventType.RIGHT_DRAG]

    this.viewer.extend(Cesium.viewerCesiumNavigationMixin, {}) // 陀螺仪插件 
    // TimeLineBox.init(this.viewer, 'time-line') // 加载时间轴
    // scene.globe.enableLighting = true //地球接收来自太阳的光照产生阴影
    GlobalData.mapReady = true

    console.log('地图完毕')

    this.otherFn(fn)

  }
  otherFn(fn) {
    this.measurementPolyline = new Cesium.PolylineCollection() //量算
    this.measurementLabel = new Cesium.LabelCollection() //量算

    this.flyTo()
    this.newClass() //引class
    this.addPrimitive(fn) //添加primitive

  }
  addPrimitive(fn) {
    let scene = this.viewer.scene
    //总数据
    // scene.primitives.add(mapDataStore)
    // scene.primitives.add(historyDataStroe)

    //量算

    scene.primitives.add(this.measurementPolyline)
    scene.primitives.add(this.measurementLabel)

    fn()
    // 倾斜摄影
    // let primitive = new Cesium.Cesium3DTileset({
    //   // url : "/static/qxsy",
    //   url:'http://bt1.geosts.ac.cn/api/dae/3dtile-service/3dtile/rest/v0.1.0/datastore/slave/3dtile/query/data/airport.json'
    //   // modelMatrix:modelMatrix
    // })
    // scene.primitives.add(primitive)

    // 地形
    // this.viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
    //   url: '//assets.agi.com/stk-terrain/world',
    //   requestVertexNormals: true
    // });
    // this.viewer.scene.globe.enableLighting = true;

    // scene.terrainProvider = new Cesium.CesiumTerrainProvider({ // 地表几何  地形
    //   url: 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
    //   requestVertexNormals: true, // 地形
    //   // requestWaterMask: true//水波
    // })
  }
  newClass() {
    this.listener = new CesiumEventListener() //事件集合
    this.location = new Location() // 鼠标移动位置
    this.theFirstPerspective = new TheFirstPerspective() //第一视角
    // this.follow = new Follow() //相机跟随
    this.tool = new Tool() //工具综合
  }
  flyTo() {
    //郑州
    // this.viewer.camera.flyTo({
    //   destination: Cesium.Cartesian3.fromDegrees(
    //     113.836644, 34.550386, 15000
    //   )
    // });

    //海
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        120.91558, 38.391155, 15000
      )
    });
  }
  getGlobalDataCurrentSelectObject() {
    return GlobalData.currentSelectObject
  }
  setFollowOpen(val) {
    GlobalData.setFollowOpen = val
  }
  getStyleById(id) {
    for (let i = 0; i < GlobalData.styleList.length; i++) {
      if (GlobalData.styleList[i].id == id) {
        return GlobalData.styleList[i]
      }
    }
    return null
  }
  formStyleToStyle(style) {
    try {
      let sidlist = JSON.parse(style)
      if (sidlist.length > 0) {
        let sid = sidlist[0]
        let style = this.getStyleById(sid)
        return style
      }
      return null
    } catch (err) {
      return null

    }

  }
}
let map = new Map()

export default map