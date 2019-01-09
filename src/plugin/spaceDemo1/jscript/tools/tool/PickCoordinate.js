import ToolEvent from '../toolEvent'

import map from '../../cesiumMap/map.js'
import Vue from 'vue'
var vue = new Vue
/* 
    获取屏幕坐标
*/
class PickCoordinate extends ToolEvent {
  constructor() {
    super()
  }
  getName() {
    return 'PickCoordinate'
  }
  mouseLeftClick(eve) {
    console.log('开始PickCoordinate')
    let ellipsoid = map.viewer.scene.globe.ellipsoid;
    let cartesian = map.viewer.camera.pickEllipsoid(eve.position, ellipsoid);
    let longitudeString = ""
    let latitudeString = ""
    if (cartesian) {
      //将笛卡尔坐标转换为地理坐标
      let cartographic = ellipsoid.cartesianToCartographic(cartesian);
      //将弧度转为度的十进制度表示
      longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
      latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
      map.tool.setCurrent('PickModel')
      vue.$confirm('经度纬度：' + longitudeString.toFixed(6) + ' ' + latitudeString.toFixed(6), '坐标位置', {}).then(() => {}).catch(() => {});
    }
  }

}
export default PickCoordinate
