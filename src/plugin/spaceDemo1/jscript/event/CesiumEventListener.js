import globalData from '../GlobalData'
import map from '../cesiumMap/map'
import {
  MapEvent,
  EventAll
} from './Event'

class CesiumEventListener {
  constructor(cesium) {
    this.cesium = map.viewer
    // this.moveEndCesium()
    this.mouseEventLeft()
    this.mouseEventRight()
    this.mouseEventMove()
  }

  moveEndCesium() {
 
    this.cesium.scene.camera.moveEnd.addEventListener(() => {
      let tilesToRender = this.cesium.scene.globe._surface._tilesToRender
      console.log(this.cesium.scene.globe._surface)
      // if(!globalData.setFollowOpen){
      //   debounce(tilesToRender)
      // }
    })
  }
  mouseEventLeft() {
    let handler = new Cesium.ScreenSpaceEventHandler(this.cesium.scene.canvas)
    handler.setInputAction(eve => {
      let obj = {
        eve: eve
      }
      EventAll.fire(MapEvent.PickObject, obj)

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)


  }
  mouseEventRight() {
    let handler = new Cesium.ScreenSpaceEventHandler(this.cesium.scene.canvas)
    handler.setInputAction(eve => {
      let obj = {
        eve: eve
      }
      EventAll.fire(MapEvent.MouseRight, obj)
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)


  }
  mouseEventMove() {
    let handler = new Cesium.ScreenSpaceEventHandler(this.cesium.scene.canvas)
    handler.setInputAction(eve => {
      let obj = {
        eve: eve
      }
      EventAll.fire(MapEvent.MouseMove, obj)
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)


  }
}
export default CesiumEventListener
